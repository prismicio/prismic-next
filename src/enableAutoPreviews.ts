import { PreviewData } from "next";
import * as nextHeaders from "next/headers";
import type * as prismic from "@prismicio/client";
import { FlexibleNextApiRequestLike } from "./types";

interface PrismicNextPreviewData {
	ref: string;
}

/**
 * Determines if a Next.js preview data object contains Prismic preview data.
 *
 * @param previewData - The Next.js preview data object to check.
 *
 * @returns `true` if `previewData` contains Prismic preview data, `false`
 *   otherwise.
 */
const isPrismicNextPreviewData = (
	previewData: PreviewData,
): previewData is PrismicNextPreviewData => {
	return typeof previewData === "object" && "ref" in previewData;
};

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
} & (
	| {
			/**
			 * A Next.js context object (such as the context object from
			 * `getStaticProps` or `getServerSideProps`).
			 *
			 * Pass a `context` object when using `enableAutoPreviews` outside a
			 * Next.js API endpoint.
			 */
			previewData?: TPreviewData;
	  }
	| FlexibleNextApiRequestLike
);
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
		// If preview data is being passed from Next Context then use queryContentFromRef

		const { previewData } = config;

		if (isPrismicNextPreviewData(previewData) && previewData.ref) {
			config.client.queryContentFromRef(previewData.ref);
		}
	} else {
		if (nextHeaders.draftMode && nextHeaders.draftMode().enabled) {
			// TODO: Get the cookie and query from that ref.
			// TODO: Update `@prismicio/client` to fetch the preview token/ref from the cookie
		} else {
			if (
				("request" in config && config.request) ||
				("req" in config && config.req)
			) {
				const request = "request" in config ? config.request : config.req;

				// If the req object is passed then use enableAutoPreviewsFromReq

				config.client.enableAutoPreviewsFromReq(request);
			}
		}
	}
};
