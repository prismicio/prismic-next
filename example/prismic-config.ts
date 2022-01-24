/** Example file */

import { createClient, getEndpoint } from '@prismicio/client';
import { LinkResolverFunction } from '@prismicio/helpers';
import { enableAutoPreviews, CreateClientConfig } from 'prismic-next';

export const apiEndpoint = getEndpoint('smashing-mag-nick-1');

export const linkResolver: LinkResolverFunction = (doc) => {
  if (doc.type === 'product') {
    return `/products/${doc.uid}`;
  }
  return '/';
};

export const createPrismicClient = (config: CreateClientConfig) => {
  const client = createClient(apiEndpoint);

  enableAutoPreviews({
    client,
    context: config.context,
    req: config.req,
  });

  return client;
};
