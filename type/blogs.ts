export interface BlogsType {
  id: number;
  title: string;
  content: { id: number; title: string; paragraph: string }[];
  reference: { id: number; title: string; link: string }[];
}
