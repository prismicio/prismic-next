import type { PreviewData } from "next";
import type { Client } from "@prismicio/client";

import type { NextApiRequestLike } from "./types";

/**
 * Configuration for `enableAutoPreviews`.
 *
 * @typeParam TPreviewData - Next.js preview data object.
 */
export type EnableAutoPreviewsConfig = {
	/**
	 * Prismic client with which automatic previews will be enabled.
	 */
	// `Pick` is used to use the smallest possible subset of
	// `prismic.Client`. Doing this reduces the surface area for breaking
	// type changes.
	client: Pick<Client, "queryContentFromRef" | "enableAutoPreviewsFromReq">;

	/**
	 * The `previewData` object provided in the `getStaticProps()` or
	 * `getServerSideProps()` context object.
	 */
	previewData?: PreviewData;

	/**
	 * The `req` object from a Next.js API route.
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
export function enableAutoPreviews(config: EnableAutoPreviewsConfig): void {
	if ("previewData" in config && config.previewData) {
		// Assume we are in `getStaticProps()` or
		// `getServerSideProps()` with active Preview Mode.

		if (isPrismicPreviewData(config.previewData)) {
			config.client.queryContentFromRef(config.previewData.ref);
		}

		return;
	}

	if ("req" in config && config.req) {
		// Assume we are in an API Route.

		config.client.enableAutoPreviewsFromReq(config.req);

		return;
	}
}

function isPrismicPreviewData(input: unknown): input is { ref: string } {
	return typeof input === "object" && input !== null && "ref" in input;
}
