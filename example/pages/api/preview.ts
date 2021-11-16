/* eslint-disable import/no-anonymous-default-export */
import { linkResolver, createClient } from '../../prismic-config';
import * as prismicNext from 'prismic-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({ req });

  prismicNext.setPreviewData({ req, res });

  await prismicNext.redirectToPreviewURL({ res, client, linkResolver });
};
