export interface BlogsType {
  id: number;
  title: string;
  paragraph: string;
  content: string;
  reference: { id: number; title: string; link: string }[];
}
