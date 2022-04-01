import * as prismic from "@prismicio/client";
import { LinkResolverFunction } from "@prismicio/helpers";
import { enableAutoPreviews } from "@prismicio/next";
import type { CreateClientConfig } from "@prismicio/next";

import sm from "./sm.json";

export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint);

export const linkResolver: LinkResolverFunction<string | null> = (doc) => {
	if (doc.type === "page" && doc.uid === "home") {
		return "/";
	}

	return null;
};

export const createClient = (config: CreateClientConfig = {}) => {
	const client = prismic.createClient(sm.apiEndpoint, {
		routes: [
			{
				type: "page",
				path: "/:uid",
			},
		],
	});

	enableAutoPreviews({
		client,
		previewData: config.previewData,
		req: config.req,
	});

	return client;
};
