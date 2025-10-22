import { cookie } from "@prismicio/client";

import type { NextApiRequestLike, NextApiResponseLike } from "./types";

/** Configuration for `setPreviewData()`. */
export type SetPreviewDataConfig = {
	/**
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: https://nextjs.org/docs/pages/building-your-application/routing/api-routes
	 */
	req: NextApiRequestLike;

	/**
	 * The `res` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: https://nextjs.org/docs/pages/building-your-application/routing/api-routes
	 */
	res: NextApiResponseLike;
};

/**
 * Sets Prismic preview data for Next.js Preview Mode in a Pages Router API
 * route.
 *
 * @example
 *
 * ```typescript
 * // src/pages/api/preview.ts
 * import {
 * 	setPreviewData,
 * 	redirectToPreviewURL,
 * } from "@prismicio/next/pages";
 * import { createClient } from "@/prismicio";
 *
 * export default async function handler(req, res) {
 * 	const client = createClient({ req });
 *
 * 	setPreviewData({ req, res });
 *
 * 	await redirectToPreviewURL({ client, req, res });
 * }
 * ```
 *
 * @param config - Configuration object containing the request and response
 *   objects.
 *
 * @see Prismic preview setup: https://prismic.io/docs/previews-nextjs
 */
export function setPreviewData({ req, res }: SetPreviewDataConfig): void {
	const ref = req.query.token || req.cookies[cookie.preview];

	if (ref) {
		res.setPreviewData({ ref });
	}
}
