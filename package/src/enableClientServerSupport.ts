import { GetStaticPropsContext, NextApiRequest, PreviewData } from "next";
import * as prismic from "@prismicio/client";
import { NextContextLike } from "./types";

interface PrismicNextPreviewData {
	ref: string;
}

const isPrismicNextPreviewData = (
	previewData: PreviewData,
): previewData is PrismicNextPreviewData =>
	typeof previewData === "object" && "ref" in previewData;

type EnableClientServerSupportConfig = {
	client: prismic.Client;
} & (
	| {
			context?: NextContextLike;
	  }
	| {
			req?: NextApiRequest;
	  }
);

export const enableClientServerSupport = (
	config: EnableClientServerSupportConfig,
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
