import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";

/** The project's Prismic repository name. */
export const repositoryName = "prismicio-next-dev";

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
export const createClient = (config: prismic.ClientConfig = {}) => {
	const client = prismic.createClient(repositoryName, {
		routes,
		// fetchOptions:
		// 	process.env.NODE_ENV === "production"
		// 		? { next: { tags: ["prismic"] }, cache: "force-cache" }
		// 		: { next: { revalidate: 5 } },
		fetchOptions: { cache: "no-store" },
		...config,
	});

	prismicNext.enableAutoPreviews({ client });

	return client;
};
