import { ObjectId } from 'mongodb';

export interface ProjectTypes {
  _id?: ObjectId | string;
  title: string;
  img: string;
  description: string;
  link: string;
}