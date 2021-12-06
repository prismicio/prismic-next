import { PreviewData, NextApiRequest, NextApiResponse } from "next";
import { LinkResolverFunction } from "@prismicio/helpers";
import { Client } from "@prismicio/client";

export type NextContextLike<TPreviewData extends PreviewData = PreviewData> = {
	previewData?: TPreviewData;
};

export type CreateClientConfig = {
	context?: NextContextLike;
	req?: NextApiRequest;
};

export type PreviewConfig = {
	req: {
		query: NextApiRequest["query"];
	};
	res: {
		redirect: NextApiResponse["redirect"];
	};
	client: Client;
	linkResolver?: LinkResolverFunction;
	defaultURL?: string;
};
