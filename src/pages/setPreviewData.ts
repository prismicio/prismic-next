import { cookie } from "@prismicio/client";

import type { NextApiRequestLike, NextApiResponseLike } from "./types";

/** Configuration for `setPreviewData`. */
export type SetPreviewDataConfig = {
	/**
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	req: NextApiRequestLike;

	/**
	 * The `res` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	res: NextApiResponseLike;
};

/** Set Prismic preview data for Next.js's Preview Mode. */
export function setPreviewData({ req, res }: SetPreviewDataConfig): void {
	const ref = req.query.token || req.cookies[cookie.preview];

	if (ref) {
		res.setPreviewData({ ref });
	}
}
