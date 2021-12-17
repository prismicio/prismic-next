import { PreviewData } from "next";
import { Client, HttpRequestLike } from "@prismicio/client";
import { NextContextLike } from "./types";

interface PrismicNextPreviewData {
	ref: string;
}

const isPrismicNextPreviewData = (
	previewData: PreviewData,
): previewData is PrismicNextPreviewData =>
	typeof previewData === "object" && "ref" in previewData;

export type EnableAutoPreviewsConfig<
	TPreviewData extends PreviewData = PreviewData,
> = {
	client: Client;
} & (
	| {
			context?: NextContextLike<TPreviewData>;
	  }
	| {
			req?: HttpRequestLike;
	  }
);
/**
 * Configures a Prismic client to automatically query draft content during a
 * preview session. Either takes in a Next.js `getStaticProps` context object or
 * a Next.js API endpoint request object.
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
