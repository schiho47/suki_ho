import { NextResponse } from 'next/server';
import { getDatabase } from '@lib/mongodb';
import { BlogsType } from 'type/blogs';

type Data = BlogsType[] | { error: string };

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<BlogsType>('blogs');

    const blogs = await collection
      .find({}, { projection: { id: 1, tags: 1, title: 1, blocks: 1, date: 1 } })
      .toArray();

    const blogsWithStringId = blogs.map((blog) => ({
      _id: blog._id?.toString(),
      id: blog.id ?? blog.notionId ?? blog._id?.toString(),
      tags: blog.tags,
      title: blog.title,
      blocks: Array.isArray(blog.blocks) ? blog.blocks.slice(0, 3) : [],
      notionId: blog.notionId,
      date: blog.date ?? null,
    }));

    return NextResponse.json(blogsWithStringId);
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

