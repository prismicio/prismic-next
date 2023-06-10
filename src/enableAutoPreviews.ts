import { draftMode, cookies } from "next/headers";
import { PreviewData } from "next";
import * as prismic from "@prismicio/client";

import { NextApiRequestLike, PrismicPreviewData } from "./types";

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
	 * **Only used in the Pages Directory (/pages).**
	 *
	 * The `previewData` object provided in the `getStaticProps()` or
	 * `getServerSideProps()` context object.
	 */
	previewData?: TPreviewData;

	/**
	 * **Only used in the Pages Directory (/pages).**
	 *
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	req?: NextApiRequestLike;
};

const isPrismicPreviewData = (input: unknown): input is PrismicPreviewData => {
	return typeof input === "object" && input !== null && "ref" in input;
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
		// Assume we are in `getStaticProps()` or
		// `getServerSideProps()` with active Preview Mode (`pages`
		// directory).

		if (isPrismicPreviewData(config.previewData)) {
			config.client.queryContentFromRef(config.previewData.ref);
		}
	} else if ("req" in config && config.req) {
		// Assume we are in an API Route (`pages` directory).

		config.client.enableAutoPreviewsFromReq(config.req);
	} else {
		// Assume we are in App Router (`app` directory) OR
		// `getStaticProps()`/`getServerSideProps()` with an inactive
		// Preview Mode (`pages` directory).

		// We use a function value so the cookie is checked on every
		// request. We don't have a static value to read from.
		config.client.queryContentFromRef(() => {
			let isDraftModeEnabled = false;
			try {
				isDraftModeEnabled = draftMode().isEnabled;
			} catch {
				// This catch block may be reached if
				// `draftMode()` is called in a place that does
				// not have access to its async storage. We can
				// ignore this case.

				return;
			}

			if (!isDraftModeEnabled) {
				return;
			}

			let cookie: string | undefined;
			try {
				cookie = cookies().get(prismic.cookie.preview)?.value;
			} catch {
				// We are probably in `getStaticProps()` or
				// `getServerSideProps()` with inactive Preview
				// Mode where `cookies()` does not work. We
				// don't need to do any preview handling.

				return;
			}

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
