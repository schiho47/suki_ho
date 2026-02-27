import { NextResponse } from 'next/server';
import { getDatabase } from '@lib/mongodb';
import { ProjectTypes } from '@type/projects';

type Data = ProjectTypes[] | { error: string };

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection<ProjectTypes>('projects');
    
    const projects = await collection.find({}).toArray();
    
    // Convert ObjectId to string for JSON serialization
    const projectsWithStringId = projects.map((project) => ({
      ...project,
      _id: project._id?.toString(),
    }));
    
    return NextResponse.json(projectsWithStringId);
  } catch (err) {
    console.error('Error fetching projects:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'failed to fetch data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

