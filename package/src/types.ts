import { PreviewData, NextApiRequest, NextApiResponse } from "next";
import { LinkResolverFunction } from "@prismicio/helpers";
import { Client } from "@prismicio/client";

/**
 * NextContext type for optional previewData param
 */
export type NextContextLike<TPreviewData extends PreviewData = PreviewData> = {
	previewData?: TPreviewData;
};

/**
 * Configuration object for creating clients
 *
 * @param context - PreviewData from NextContext
 * @param req - Next Request object
 */
export type CreateClientConfig = {
	context?: NextContextLike;
	req?: NextApiRequest;
};

/**
 * Preview config for enabling previews with redirectToPreviewURL
 *
 * @param req - Next request object with query
 * @param res - Next Response object for redirecting
 * @param Client - Prismic Client
 * @param linkResolver - Custom link resolver
 * @param defaultUrl - Url to default to after redirect
 */
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
