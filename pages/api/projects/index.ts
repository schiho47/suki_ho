import { projects } from '@data/projects';
import { ProjectTypes } from '@type/projects';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = ProjectTypes[] | { error: string };

export default function header(req: {}, res: NextApiResponse<Data>) {
  try {
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' });
  }
}
