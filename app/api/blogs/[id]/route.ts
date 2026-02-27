import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { Client } from '@notionhq/client';
import { getDatabase } from '@lib/mongodb';
import { BlogsType } from 'type/blogs';

type Data = BlogsType[] | { error: string };

const notion = new Client({
  auth: process.env.NOTION_INTERNAL_INTEGRATION_TOKEN,
});

async function fetchAllBlocks(blockId: string) {
  const allResults = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });
    allResults.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return allResults;
}

async function getPageBlocks(pageId: string) {
  const results = await fetchAllBlocks(pageId);
  const blocks: any[] = [];

  for (const block of results) {
    const blockAny = block as any;
    let mapped: any = null;

    if (blockAny.type === 'paragraph') {
      mapped = {
        type: 'text',
        content: blockAny.paragraph.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }
    if (blockAny.type === 'bulleted_list_item') {
      mapped = {
        type: 'text',
        content: `• ${blockAny.bulleted_list_item.rich_text
          .map((t: any) => t.plain_text)
          .join('')}`,
      };
    }
    if (blockAny.type === 'numbered_list_item') {
      mapped = {
        type: 'text',
        content: blockAny.numbered_list_item.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }
    if (blockAny.type === 'quote') {
      mapped = {
        type: 'text',
        content: blockAny.quote.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }
    if (blockAny.type === 'callout') {
      mapped = {
        type: 'text',
        content: blockAny.callout.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }
    if (blockAny.type === 'toggle') {
      mapped = {
        type: 'text',
        content: blockAny.toggle.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }
    if (blockAny.type === 'code') {
      mapped = {
        type: 'code',
        language: blockAny.code.language,
        content: blockAny.code.rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }
    if (blockAny.type?.startsWith('heading')) {
      mapped = {
        type: 'heading',
        content: blockAny[blockAny.type].rich_text
          .map((t: any) => t.plain_text)
          .join(''),
      };
    }
    if (blockAny.type === 'image') {
      const imageUrl =
        blockAny.image.type === 'file'
          ? blockAny.image.file.url
          : blockAny.image.external.url;
      const caption = blockAny.image.caption
        .map((t: any) => t.plain_text)
        .join('');
      mapped = {
        type: 'image',
        url: imageUrl,
        caption,
      };
    }

    if (mapped) {
      blocks.push(mapped);
    }

    if (blockAny.has_children) {
      const childBlocks = await getPageBlocks(blockAny.id);
      blocks.push(...childBlocks);
    }
  }

  return blocks;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await getDatabase();
    const collection = db.collection<BlogsType>('blogs');
    const blogId = parseInt(id, 10);
    const hasNumericId = !Number.isNaN(blogId);
    const hasObjectId = ObjectId.isValid(id);

    let blog: BlogsType | null = null;

    if (hasNumericId) {
      blog = await collection.findOne({ id: blogId });
    }

    if (!blog) {
      blog = await collection.findOne({ notionId: id });
    }

    if (!blog && hasObjectId) {
      blog = await collection.findOne({ _id: new ObjectId(id) });
    }

    const result = blog
      ? [
          {
            ...blog,
            _id: blog._id?.toString(),
            blocks: blog.notionId ? await getPageBlocks(blog.notionId) : blog.blocks,
          },
        ]
      : [];

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error fetching blog:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'failed to fetch data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

