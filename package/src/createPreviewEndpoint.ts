import { NextApiResponse, NextApiRequest } from "next";
import { LinkResolverFunction } from "@prismicio/helpers";
import { Client } from "@prismicio/client";

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
}: PreviewConfig): Promise<void> {
	const { token: ref } = req.query;

	client.enableAutoPreviewsFromReq(req);

	const previewUrl = await client.resolvePreviewURL({
		linkResolver,
		defaultURL: "/",
	});

	res.setPreviewData({ ref });
	await res.redirect(previewUrl);
}
