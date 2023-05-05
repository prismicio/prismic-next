import { NextResponse } from "next/server";

import { NextApiRequestLike, NextApiResponseLike } from "./types";

/**
 * Configuration for `exitPreview`.
 */
export type ExitPreviewConfig = {
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

/**
 * **Only use this function in the Pages Directory (/pages).**
 *
 * Exits Next.js's Preview Mode from within a Next.js API route.
 */
export async function exitPreview(
	config: ExitPreviewConfig,
): Promise<NextResponse | void> {
	// Exit the current user from Preview Mode.
	config.res.clearPreviewData();

	// 205 status is used to prevent CDN-level caching. The default 200
	// status code is typically treated as non-changing and cacheable.
	config.res.status(205).json({ success: true });
}
