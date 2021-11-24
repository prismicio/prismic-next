import { NextApiResponse } from 'next';
import { exitPreview } from 'prismic-next';

export default async function exit(_: any, res: NextApiResponse) {
  await exitPreview({ res });
}
