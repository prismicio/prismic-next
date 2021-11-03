/** Example file */

import * as Prismic from '@prismicio/client';
import Link from 'next/link';
import { Elements } from 'prismic-reactjs';
import { Box, Heading } from 'theme-ui';
import { NextApiRequest } from 'next';
import { PrismicDocument } from '@prismicio/types';
import { LinkResolverFunction } from '@prismicio/helpers';

/**
 * Walkthrough 3
 * This is the Prismic Config file, the most important thing on this file is going to be Client function.
 * That's what allows us to  make queries to the Prismic Repo
 */

/**
 * htmlSerializers are for overwriting Prismic's defaults when using the RichTextComponent. Read more here:
 * @link https://prismic.io/docs/technologies/html-serializer-reactjs
 */
// export const htmlSerializer = function (type, element, content, children, key) {
//   let props = {};

//   switch (type) {
//     case Elements.list:
//       return (
//         <Box
//           key={key}
//           as='ul'
//           sx={{ paddingLeft: '18px' }}
//           {...props}
//           children={children}
//         />
//       );
//     case Elements.listItem:
//       return (
//         <Box
//           key={key}
//           as='li'
//           variant='styles.li'
//           {...props}
//           children={children}
//         />
//       );
//     case Elements.h3:
//       return (
//         <Heading as='h3' variant='styles.h3' {...props} children={children} />
//       );
//   }
// };

// // Make sure you change `smashing-mag-nick-1` to point to your Prismic Repo URL
export const apiEndpoint = Prismic.getEndpoint('smashing-mag-nick-1');

// // -- Access Token if the repository is not public
// // Generate a token in your dashboard and configure it here if your repository is private
// export const accessToken = '';

// // -- Link resolution rules
// // Manages the url links to internal Prismic documents
export const linkResolver: LinkResolverFunction = (doc) => {
  if (doc.type === 'product') {
    return `/products/${doc.uid}`;
  }
  return '/';
};

// // Additional helper function for Next/Link components
// export const hrefResolver = (doc) => {
//   if (doc.type === 'product_collection') {
//     return '/product/[uid]';
//   }
//   return '/';
// };

// export const customLink = (type, element, content, children, index) => (
//   <Link
//     key={index}
//     href={hrefResolver(element.data)}
//     as={linkResolver(element.data)}>
//     <a>{content}</a>
//   </Link>
// );

// export const Router = {
//   routes: [],

//   href: (type) => {
//     const route = Router.routes.find((r) => r.type === type);
//     return route && route.href;
//   },
// };

/**
 * This is how we will be querying docs, see link below if you're curious.
 * https://prismic.io/docs/technologies/how-to-query-the-api-reactjs#client
 */
export const createClient = (
  req?: NextApiRequest,
  options: Prismic.ClientConfig = {}
) => {
  const prismicClient = Prismic.createClient(apiEndpoint, options);

  if (req) {
    prismicClient.enableAutoPreviewsFromReq(req);
  }
  return prismicClient;
};
