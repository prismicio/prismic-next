import { PreviewData } from "next";
import { Client, HttpRequestLike } from "@prismicio/client";
import { NextContextLike } from "./types";

interface PrismicNextPreviewData {
	ref: string;
}

/**
 * Determines if a Next.js preview data object contains Prismic preview data.
 *
 * @param previewData - The Next.js preview data object to check.
 *
 * @returns `true` if `previewData` contains Prismic preview data, `false` otherwise.
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
	client: Client;
} & (
	| {
			/**
			 * A Next.js context object (such as the context object from
			 * `getStaticProps` or `getServerSideProps`).
			 *
			 * Pass a `context` object when using `enableAutoPreviews` outside a
			 * Next.js API endpoint.
			 */
			context?: NextContextLike<TPreviewData>;
	  }
	| {
			/**
			 * A Next.js API endpoint request object.
			 *
			 * Pass a `req` object when using `enableAutoPreviews` in a Next.js API endpoint.
			 */
			req?: HttpRequestLike;
	  }
);
/**
 * Configures a Prismic client to automatically query draft content during a
 * preview session. It either takes in a Next.js `getStaticProps` context object
 * or a Next.js API endpoint request object.
 *
 * @param config - Configuration for the function.
 */
export const enableAutoPreviews = <
	TPreviewData extends PreviewData = PreviewData,
>(
	config: EnableAutoPreviewsConfig<TPreviewData>,
): void => {
	/**
	 * If preview data is being passed from Next Context then use queryContentFromRef
	 */
	if ("context" in config && config.context) {
		const previewData = config.context.previewData;

		if (isPrismicNextPreviewData(previewData) && previewData.ref) {
			config.client.queryContentFromRef(previewData.ref);
		}
		/**
		 * If the req object is passed then use enableAutoPreviewsFromReq
		 */
	} else if ("req" in config && config.req) {
		config.client.enableAutoPreviewsFromReq(config.req);
	}
};
