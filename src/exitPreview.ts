import * as nextHeaders from "next/headers";
import { NextResponse } from "next/server";

import { checkIsNextRequest } from "./lib/checkIsNextRequest";

import {
	FlexibleNextApiRequestLike,
	FlexibleNextRequestLike,
	NextApiResponseLike,
} from "./types";

/**
 * Configuration for `exitPreview`.
 */
export type ExitPreviewConfig =
	| FlexibleNextRequestLike
	| (FlexibleNextApiRequestLike & {
			/**
			 * The `res` object from a Next.js API route.
			 *
			 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
			 */
			res: NextApiResponseLike;
	  });

/**
 * Exits a Prismic Preview by disabling Draft Mode or Preview Mode, whichever
 * one is active.
 */
export async function exitPreview(
	config: ExitPreviewConfig,
): Promise<NextResponse | void> {
	const request = "request" in config ? config.request : config.req;
	const isNextRequest = checkIsNextRequest(request);

	if (isNextRequest) {
		// In a Route Handler.

		// `draftMode` was added in Next.js v13.4. This library
		// supports v13.0, so we must check if `draftMode` exists.
		//
		// Note that Draft Mode _must_ be used when using Route
		// Handlers; Preview Mode is not supported in App Router.
		if (!nextHeaders.draftMode) {
			throw new Error(
				"[exitPreview] Next.js Draft Mode is used when using `exitPreview()` in a Route Handler. It appears the installed version of Next.js does not support Draft Mode. Please update to at least next@13.4.0.",
			);
		}

		// Disable Draft Mode
		nextHeaders.draftMode().disable();

		// 205 status is used to prevent CDN-level caching. The default 200
		// status code is typically treated as non-changing and cacheable.
		return NextResponse.json({ success: true });
	} else {
		// In an API route.

		if (!("res" in config)) {
			throw new Error(
				"[exitPreview] The `res` object from the API route must be provided to `exitPreview()`.",
			);
		}

		// Disable Draft Mode
		config.res.setDraftMode?.({ enable: false });

		// Disable Preview Mode
		config.res.clearPreviewData();

		// 205 status is used to prevent CDN-level caching. The default 200
		// status code is typically treated as non-changing and cacheable.
		config.res.status(205).json({ success: true });
	}
}
