import { ObjectId } from 'mongodb';

export interface BlogsType {
  _id?: ObjectId | string;
  id: number | string;
  title: string;
  titleEn?: string;
  paragraph?: string;
  content?: string;
  link?: string;
  reference?: { id: number; title: string; link: string }[];
  tags?: string[];
  blocks?: {
    url?: string;
    caption?: string;
    type: string;
    content?: string;
    language?: string;
  }[];
  blocksEn?: {
    url?: string;
    caption?: string;
    type: string;
    content?: string;
    language?: string;
  }[];
  pdfUrl?: string;
  startPage?: number;
  endPage?: number;
  notionId?: string;
  date?: string | null;
}
