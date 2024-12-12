import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next/pages";

/** The project's Prismic repository name. */
export const repositoryName = "prismicio-next-test";

/**
 * The project's Prismic Route Resolvers. This list determines a Prismic
 * document's URL.
 */
const routes: prismic.ClientConfig["routes"] = [
	{ type: "page", path: "/:uid" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
	const client = prismic.createClient(repositoryName, {
		routes,
		...config,
	});

	prismicNext.enableAutoPreviews({
		client,
		previewData: config.previewData,
		req: config.req,
	});

	return client;
};
