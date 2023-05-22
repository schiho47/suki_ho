import type { NextApiRequest, NextApiResponse } from 'next'
import { projects } from 'data/projects/projects'
type Data = {title:string,description:string,link:string}[]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(projects);
}
