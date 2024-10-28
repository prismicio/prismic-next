import { draftMode } from "next/headers";

import { NextApiRequestLike, NextApiResponseLike } from "./types";

/**
 * @deprecated Use `ExitPreviewAPIRouteConfig` instead when `exitPreview()` is
 *   used in a Pages Router API endpoint. `exitPreview()` does not require any
 *   configuration when used in an App Router Route Handler.
 */
export type ExitPreviewConfig = ExitPreviewAPIRouteConfig;

/**
 * Configuration for `exitPreview()` when used in a Pages Router API route.
 */
export type ExitPreviewAPIRouteConfig = {
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
 * used in a Router Handler or an API route, depending on whether you are using
 * the App Router or Pages Router.
 *
 * @example Usage within an App Router Route Handler.
 *
 * ```typescript
 * // src/app/api/exit-preview/route.js
 *
 * import { exitPreview } from "@prismicio/next";
 *
 * export function GET() {
 * 	return exitPreview();
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
 * export default function handler(req, res) {
 * 	exitPreview({ req, res });
 * }
 * ```
 */
export async function exitPreview(): Promise<Response>;
export async function exitPreview(
	config: ExitPreviewAPIRouteConfig,
): Promise<void>;
export async function exitPreview(
	config?: ExitPreviewAPIRouteConfig,
): Promise<Response | void> {
	if (config?.res) {
		// Assume Preview Mode is being used.

		config.res.clearPreviewData();

		// `Cache-Control` header is used to prevent CDN-level caching.
		config.res.setHeader("Cache-Control", "no-store");

		config.res.json({ success: true });

		return;
	} else {
		// Assume Draft Mode is being used.

		(await draftMode()).disable();

		// `Cache-Control` header is used to prevent CDN-level caching.
		return new Response(JSON.stringify({ success: true }), {
			headers: {
				"Cache-Control": "no-store",
			},
		});
	}
}
