import { NextApiResponse, NextApiRequest } from "next";
import * as prismic from "@prismicio/client";

/**
 * Configuration for `setPreviewData`.
 */
export type SetPreviewDataConfig = {
	/**
	 * The `req` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	req: {
		query: NextApiRequest["query"];
		cookies: NextApiRequest["cookies"];
	};

	/**
	 * The `res` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	res: {
		setPreviewData: NextApiResponse["setPreviewData"];
	};
};

/**
 * Set Prismic preview data for Next.js's Preview Mode.
 */
export async function setPreviewData({
	req,
	res,
}: SetPreviewDataConfig): Promise<void> {
	const ref = req.query.token || req.cookies[prismic.cookie.preview];

	if (ref) {
		res.setPreviewData({ ref });
	}
}
