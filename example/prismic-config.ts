/** Example file */

import * as Prismic from '@prismicio/client';
import { Box, Heading } from 'theme-ui';
import { GetStaticPropsContext, NextApiRequest } from 'next';
import { LinkResolverFunction } from '@prismicio/helpers';
import { enableClientServerSupport } from 'prismic-next';

export const apiEndpoint = Prismic.getEndpoint('smashing-mag-nick-1');

export const linkResolver: LinkResolverFunction = (doc) => {
  if (doc.type === 'product') {
    return `/products/${doc.uid}`;
  }
  return '/';
};

export const createClient = (
  context: GetStaticPropsContext,
  options: Prismic.ClientConfig = {}
) => {
  const prismicClient = Prismic.createClient(apiEndpoint, options);

  enableClientServerSupport(prismicClient, context);

  return prismicClient;
};
