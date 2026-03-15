import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@lib/mongodb';
import { BlogsType } from 'type/blogs';

type Data =
  | {
      items: BlogsType[];
      tags: string[];
      total: number;
      page: number;
      limit: number;
    }
  | { error: string };

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') || 'zh';
    const tag = request.nextUrl.searchParams.get('tag') || '';
    const pageParam = Number(request.nextUrl.searchParams.get('page') || '1');
    const limitParam = Number(request.nextUrl.searchParams.get('limit') || '5');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 5;
    const skip = (page - 1) * limit;
    const db = await getDatabase();
    const collection = db.collection<BlogsType>('blogs');
    const filter = tag ? { tags: tag } : {};

    const [blogs, total, tagDocs] = await Promise.all([
      collection
        .find(
          filter,
          {
            projection: {
              id: 1,
              tags: 1,
              title: 1,
              titleEn: 1,
              blocks: 1,
              blocksEn: 1,
              date: 1,
            },
          }
        )
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
      collection
        .aggregate<{ tag: string }>([
          { $unwind: { path: '$tags', preserveNullAndEmptyArrays: false } },
          { $group: { _id: '$tags' } },
          { $project: { _id: 0, tag: '$_id' } },
        ])
        .toArray(),
    ]);

    const blogsWithStringId = blogs.map((blog) => ({
      _id: blog._id?.toString(),
      id: blog.id ?? blog.notionId ?? blog._id?.toString(),
      tags: blog.tags,
      title: lang === 'en' ? blog.titleEn || blog.title : blog.title,
      blocks:
        lang === 'en'
          ? Array.isArray(blog.blocksEn)
            ? blog.blocksEn.slice(0, 3)
            : Array.isArray(blog.blocks)
              ? blog.blocks.slice(0, 3)
              : []
          : Array.isArray(blog.blocks)
            ? blog.blocks.slice(0, 3)
            : [],
      notionId: blog.notionId,
      date: blog.date ?? null,
    }));

    return NextResponse.json({
      items: blogsWithStringId,
      tags: tagDocs.map((doc) => doc.tag).filter(Boolean),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching blogs:', err);
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

