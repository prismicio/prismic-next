/**
 * Example file
 */

import * as Prismic from "@prismicio/client";
import { LinkResolverFunction } from "@prismicio/helpers";
import { enableAutoPreviews, CreateClientConfig } from "@prismicio/next";

export const apiEndpoint = Prismic.getEndpoint("smashing-mag-nick-1");

export const linkResolver: LinkResolverFunction = (doc) => {
	if (doc.type === "product") {
		return `/products/${doc.uid}`;
	}

	return "/";
};

export const createClient = (config: CreateClientConfig): Prismic.Client => {
	const client = Prismic.createClient(apiEndpoint);

	enableAutoPreviews({
		client,
		previewData: config.previewData,
		req: config.req,
	});

	return client;
};
