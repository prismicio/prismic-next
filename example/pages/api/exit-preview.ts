import { NextApiResponse, NextApiRequest } from 'next';
import { exitPreview } from 'prismic-next';

export default async function exit(req: NextApiRequest, res: NextApiResponse) {
  await exitPreview({ res, req });
}
