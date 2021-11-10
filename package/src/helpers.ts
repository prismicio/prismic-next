import { GetStaticPropsContext, PreviewData } from "next";
import * as prismic from "@prismicio/client";

interface PrismicNextPreviewData {
	ref: string;
}

const isPrismicNextPreviewData = (
	previewData: PreviewData,
): previewData is PrismicNextPreviewData =>
	typeof previewData === "object" && "ref" in previewData;

export const getPreviewRefFromContext = (
	context: GetStaticPropsContext,
): string | undefined => {
	if (isPrismicNextPreviewData(context.previewData)) {
		return context.previewData.ref;
	}
};

export const enableClientServerSupport = (
	client: prismic.Client,
	context: GetStaticPropsContext,
): void => {
	const ref = getPreviewRefFromContext(context);

	if (ref) {
		client.queryContentFromRef(ref);
	}
};
