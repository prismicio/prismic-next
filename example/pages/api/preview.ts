/* eslint-disable import/no-anonymous-default-export */
import { linkResolver, createClient } from '../../prismic-config';
import * as prismicNext from 'prismic-next';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await prismicNext.createPreviewEndpoint({
    req,
    res,
    client: createClient(req),
    linkResolver,
  });
};
