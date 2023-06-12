import { draftMode } from "next/headers";

import { NextApiRequestLike, NextApiResponseLike } from "./types";

/**
 * Configuration for `exitPreview`.
 */
export type ExitPreviewConfig = {
	/**
	 * **Only use this parameter in the Pages Directory (/pages).**
	 *
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	req?: NextApiRequestLike;

	/**
	 * **Only use this parameter in the Pages Directory (/pages).**
	 *
	 * The `res` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	res?: NextApiResponseLike;
};

/**
 * Ends a Prismic preview session within a Next.js app. This function should be
 * used in a Router Handler or an API Route, depending on which you are using
 * the App Router or Pages Router.
 *
 * `exitPreview()` assumes Draft Mode is being used unless a Pages Router API
 * Route `res` object is provided to the function.
 *
 * @example Usage within an App Router Route Handler.
 *
 * ```typescript
 * // src/app/exit-preview/route.js
 *
 * import { exitPreview } from "@prismicio/next";
 *
 * export async function GET() {
 * 	await exitPreview();
 * }
 * ```
 *
 * @example Usage within a Pages Router API Route.
 *
 * ```typescript
 * // src/pages/api/exit-preview.js
 *
 * import { exitPreview } from "@prismicio/next";
 *
 * export default async function handler(req, res) {
 * 	await exitPreview({ req, res });
 * }
 * ```
 */
export async function exitPreview(
	config?: ExitPreviewConfig,
): Promise<Response | void> {
	if (config?.res) {
		// Assume Preview Mode is being used.

		config.res.clearPreviewData();

		// 205 status is used to prevent CDN-level caching. The default 200
		// status code is typically treated as non-changing and cacheable.
		config.res.json({ success: true });
		config.res.setHeader("Cache-Control", "no-store");

		return;
	} else {
		// Assume Draft Mode is being used.

		draftMode().disable();

		// 205 status is used to prevent CDN-level caching. The default 200
		// status code is typically treated as non-changing and cacheable.
		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Cache-Control": "no-store",
			},
		});
	}
}
