import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next/pages";

export const createClient = (
	repositoryName: string,
	config: prismicNext.CreateClientConfig = {},
) => {
	const client = prismic.createClient(repositoryName, {
		routes: [{ type: "page", path: "/:uid" }],
		...config,
	});

	prismicNext.enableAutoPreviews({
		client,
		previewData: config.previewData,
		req: config.req,
	});

	return client;
};
