import { linkResolver, createClient } from '../../prismic-config';
import { createPreviewEndpoint } from 'prismic-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await createPreviewEndpoint({
    req,
    res,
    client: createClient(req),
    linkResolver,
  });
};
