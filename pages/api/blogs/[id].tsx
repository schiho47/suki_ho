import type { NextApiRequest, NextApiResponse } from "next";
import { blogs } from "data/blogs";
import { BlogsType } from "type/blogs";

interface BlogRequestType extends NextApiRequest {
  id: number;
}

type Data = BlogsType[] | { error: string };

export default function header(
  req: BlogRequestType,
  res: NextApiResponse<Data>
) {
  try {
    const { id } = req.query;
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" });
  }
}
