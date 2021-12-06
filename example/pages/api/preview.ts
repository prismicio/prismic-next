/* eslint-disable import/no-anonymous-default-export */
import { linkResolver, createClient } from '../../prismic-config';
import { setPreviewData, redirectToPreviewURL } from 'prismic-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = createClient({ req });

  await setPreviewData({ req, res });

  await redirectToPreviewURL({ req, res, client, linkResolver });
};
