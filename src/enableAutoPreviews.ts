import { PreviewData } from "next";
import { cookies } from "next/headers";
import * as prismic from "@prismicio/client";

import { NextApiRequestLike } from "./types";

/**
 * Configuration for `enableAutoPreviews`.
 *
 * @typeParam TPreviewData - Next.js preview data object.
 */
export type EnableAutoPreviewsConfig<
	TPreviewData extends PreviewData = PreviewData,
> = {
	/**
	 * Prismic client with which automatic previews will be enabled.
	 */
	// `Pick` is used to use the smallest possible subset of
	// `prismic.Client`. Doing this reduces the surface area for breaking
	// type changes.
	client: Pick<
		prismic.Client,
		"queryContentFromRef" | "enableAutoPreviewsFromReq"
	>;

	/**
	 * A Next.js context object (such as the context object from `getStaticProps`
	 * or `getServerSideProps`).
	 *
	 * Pass a `context` object when using `enableAutoPreviews` outside a Next.js
	 * API endpoint.
	 */
	previewData?: TPreviewData;

	/**
	 * The request object from a Next.js API route.
	 *
	 * **Alias**: `request`
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	req?: NextApiRequestLike;
};

/**
 * Configures a Prismic client to automatically query draft content during a
 * preview session. It either takes in a Next.js `getStaticProps` context object
 * or a Next.js API endpoint request object.
 *
 * @param config - Configuration for the function.
 */
export const enableAutoPreviews = <TPreviewData extends PreviewData>(
	config: EnableAutoPreviewsConfig<TPreviewData>,
): void => {
	if ("previewData" in config && config.previewData) {
		// Assume we are in `getStaticProps()` or `getServerSideProps()` (`pages` directory).

		if (
			typeof config.previewData === "object" &&
			"ref" in config.previewData &&
			typeof config.previewData.ref === "string"
		) {
			config.client.queryContentFromRef(config.previewData.ref);
		}
	} else if ("req" in config && config.req) {
		// Assume we are in an API Route (`pages` directory).

		config.client.enableAutoPreviewsFromReq(config.req);
	} else {
		// Assume we are in App Router (`pages` directory).

		// We use a function value so the cookie is checked on every
		// request. We don't have a static value to read from.
		config.client.queryContentFromRef(() => {
			const cookie = cookies().get(prismic.cookie.preview)?.value;

			// We only return the cookie if a Prismic Preview session is active.
			//
			// An inactive cookie looks like this (URL encoded):
			// 	{
			// 		"_tracker": "abc123"
			// 	}
			//
			// An active cookie looks like this (URL encoded):
			// 	{
			// 		"_tracker": "abc123",
			// 		"example-prismic-repo.prismic.io": {
			// 			preview: "https://example-prismic-repo.prismic.io/previews/abc:123?websitePreviewId=xyz"
			// 		}
			// 	}
			if (cookie && /\.prismic\.io/.test(cookie)) {
				return cookie;
			}
		});
	}
};
