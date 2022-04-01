/**
 * Example file
 */

import { Client, createClient } from "@prismicio/client";
import { LinkResolverFunction } from "@prismicio/helpers";
import { enableAutoPreviews, CreateClientConfig } from "@prismicio/next";

export const repositoryName = "smashing-mag-nick-1";

export const linkResolver: LinkResolverFunction = (doc) => {
	if (doc.type === "product") {
		return `/products/${doc.uid}`;
	}

	return "/";
};

export const createPrismicClient = (config: CreateClientConfig): Client => {
	const client = createClient(repositoryName);

	enableAutoPreviews({
		client,
		previewData: config.previewData,
		req: config.req,
	});

	return client;
};
