import { NextApiResponse, NextApiRequest } from "next";
import { LinkResolverFunction } from "@prismicio/helpers";
import { Client } from "@prismicio/client";

/**
 * TODO
 * Create preview endpoint config
 * Refer to Client types from @prismicio/client (resolvePreviewURL)
 * import nextJS types for req and res
 */

export type PreviewConfig = {
	req: NextApiRequest;
	res: NextApiResponse;
	client: Client;
	linkResolver: LinkResolverFunction;
};

export async function createPreviewEndpoint({
	req,
	res,
	client,
	linkResolver,
}: PreviewConfig) {
	const { token: ref } = req.query;

	await client.enableAutoPreviewsFromReq(req);

	const previewUrl = await client.resolvePreviewURL({
		linkResolver,
		defaultURL: "/",
	});

	res.setPreviewData({ ref });
	await res.redirect(previewUrl);
}
