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

export const enableAutoPreviews = <
	TPreviewData extends PreviewData = PreviewData,
>(
	config: EnableAutoPreviewsConfig<TPreviewData>,
): void => {
	if ("context" in config && config.context) {
		const previewData = config.context.previewData;

		if (isPrismicNextPreviewData(previewData) && previewData.ref) {
			config.client.queryContentFromRef(previewData.ref);
		}
	} else if ("req" in config && config.req) {
		config.client.enableAutoPreviewsFromReq(config.req);
	}
};
