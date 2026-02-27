const path = require('path');
const fs = require('fs/promises');
const dotenv = require('dotenv');


dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const { Client } = require('@notionhq/client');
const mongoose = require('mongoose');

// 1. 初始化 Notion 客戶端
const notion = new Client({ auth: process.env.NOTION_INTERNAL_INTEGRATION_TOKEN });
const DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID;
console.log('當前讀取的 Database ID:', DATABASE_ID);
// 2. 定義 MongoDB Schema (沿用之前的設計)
const blogSchema = new mongoose.Schema({
  title: String,
  tags: [String],
  notionId: { type: String, unique: true },
  date: String,
  blocks: [
    {
      type: { type: String }, // 'text', 'code', 'heading'
      content: String,
      language: String
    }
  ],
  updatedAt: Date
});

const Blog = mongoose.model('Blog', blogSchema);

const imagesDir = path.resolve(__dirname, '../public/notion-images');

async function ensureImagesDir() {
  await fs.mkdir(imagesDir, { recursive: true });
}

function getFileExtension(url, contentType) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname);
    if (ext) return ext;
  } catch (err) {
    // ignore
  }

  if (contentType?.includes('png')) return '.png';
  if (contentType?.includes('webp')) return '.webp';
  if (contentType?.includes('gif')) return '.gif';
  return '.jpg';
}

async function downloadImage(url, fileName) {
  await ensureImagesDir();
  const filePath = path.join(imagesDir, fileName);

  try {
    await fs.access(filePath);
    return filePath;
  } catch (err) {
    // file doesn't exist
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  const ext = getFileExtension(url, contentType);
  const finalPath = filePath.endsWith(ext) ? filePath : `${filePath}${ext}`;
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(finalPath, buffer);
  return finalPath;
}

// 3. 轉換 Notion Block 到我們的 JSON 格式
async function fetchAllBlocks(blockId) {
  const allResults = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor
    });
    allResults.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return allResults;
}

async function getPageBlocks(pageId) {
  const results = await fetchAllBlocks(pageId);
  const blocks = [];

  for (const block of results) {
    let mapped = null;

    if (block.type === 'paragraph') {
      mapped = {
        type: 'text',
        content: block.paragraph.rich_text.map(t => t.plain_text).join('')
      };
    }
    if (block.type === 'bulleted_list_item') {
      mapped = {
        type: 'text',
        content: `• ${block.bulleted_list_item.rich_text.map(t => t.plain_text).join('')}`
      };
    }
    if (block.type === 'numbered_list_item') {
      mapped = {
        type: 'text',
        content: block.numbered_list_item.rich_text.map(t => t.plain_text).join('')
      };
    }
    if (block.type === 'quote') {
      mapped = {
        type: 'text',
        content: block.quote.rich_text.map(t => t.plain_text).join('')
      };
    }
    if (block.type === 'callout') {
      mapped = {
        type: 'text',
        content: block.callout.rich_text.map(t => t.plain_text).join('')
      };
    }
    if (block.type === 'toggle') {
      mapped = {
        type: 'text',
        content: block.toggle.rich_text.map(t => t.plain_text).join('')
      };
    }
    if (block.type === 'code') {
      mapped = {
        type: 'code',
        language: block.code.language,
        content: block.code.rich_text.map(t => t.plain_text).join('')
      };
    }
    if (block.type.startsWith('heading')) {
      mapped = {
        type: 'heading',
        content: block[block.type].rich_text.map(t => t.plain_text).join('')
      };
    }
    if (block.type === 'image') {
      const imageUrl =
        block.image.type === 'file'
          ? block.image.file.url
          : block.image.external.url;
      const caption = block.image.caption
        .map(t => t.plain_text)
        .join('');
      let resolvedUrl = imageUrl;

      if (block.image.type === 'file' && imageUrl) {
        const fileName = block.id.replace(/-/g, '');
        const savedPath = await downloadImage(imageUrl, fileName);
        resolvedUrl = `/notion-images/${path.basename(savedPath)}`;
      }

      mapped = {
        type: 'image',
        url: resolvedUrl,
        caption
      };
    }

    if (mapped) {
      blocks.push(mapped);
    }

    if (block.has_children) {
      const childBlocks = await getPageBlocks(block.id);
      blocks.push(...childBlocks);
    }
  }

  return blocks;
}

// 4. 主同步邏輯
async function syncNotionToMongo() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // --- 直接從搜尋結果抓取資料庫 ---
  const searchResponse = await notion.search({
    filter: { property: 'object', value: 'data_source' }
  });

  // 找到標題叫做 "Blogs" 的那個資料庫
  const targetDb = searchResponse.results.find(
    db => db.title[0]?.plain_text === 'Blogs'
  );

  if (!targetDb) {
    console.error('在 Notion 中找不到名為 Blogs 的資料庫！');
    return;
  }

  console.log('成功定位資料庫！實際 ID 為:', targetDb.id);

  // 使用搜尋到的 ID 進行查詢（新版 SDK 用 dataSources.query）
  const queryPayload = {
    filter: {
      property: 'status',
      rich_text: { equals: 'Ready' }
    }
  };

  const response = notion.databases?.query
    ? await notion.databases.query({ database_id: targetDb.id, ...queryPayload })
    : await notion.dataSources.query({ data_source_id: targetDb.id, ...queryPayload });

  console.log(`準備同步 ${response.results.length} 篇文章...`);

  for (const page of response.results) {
    const titleParts = page.properties.title.title;
    const date =
      page.properties.date?.date?.start ||
      page.properties.Date?.date?.start ||
      null;
    const title =
      (Array.isArray(titleParts)
        ? titleParts.map((item) => item?.plain_text || '').join('')
        : '') || 'Untitled';
    const tags = page.properties.tags.rich_text[0].plain_text
    const notionId = page.id;

    console.log(`Syncing: ${title}...`);

    // 抓取該頁面的所有 Blocks
    const blocks = await getPageBlocks(notionId);

    // 更新或插入到 MongoDB
    await Blog.findOneAndUpdate(
      { notionId },
      { title, tags, blocks, date, updatedAt: new Date() },
      { upsert: true }
    );
  }

  console.log('Sync Complete!');
  process.exit();
}

syncNotionToMongo().catch(console.error);