import { ObjectId } from 'mongodb';

export interface BlogsType {
  _id?: ObjectId | string;
  id: number | string;
  title: string;
  paragraph?: string;
  content?: string;
  link?: string;
  reference?: { id: number; title: string; link: string }[];
  tags?: string[];
  blocks?: {
    url: string | undefined;
    caption: string; type: string; content: string; language?: string 
}[];
  notionId?: string;
  date?: string | null;
}
