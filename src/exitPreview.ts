// TODO: Replace the "next/headers" import with the following line once Next.js
// 13.4 is available.
// import { draftMode } from "next/headers";
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

		// Disable Draft Mode
		// TODO: Replace the `nextHeaders.draftMode()` call with the
		// following line once Next.js 13.4 is available.
		// draftMode().disable();
		// @ts-expect-error - `draftMode()` won't be available until Next.js 13.4
		nextHeaders.draftMode().disable();

		// 205 status is used to prevent CDN-level caching. The default 200
		// status code is typically treated as non-changing and cacheable.
		return NextResponse.json({ success: true }, { status: 205 });
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
