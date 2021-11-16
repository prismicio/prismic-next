import { NextApiResponse } from "next";
import { Client } from "@prismicio/client";
import { LinkResolverFunction } from "@prismicio/helpers";

export type PreviewConfig = {
	res: NextApiResponse;
	client: Client;
	linkResolver: LinkResolverFunction;
};

export async function redirectToPreviewURL({
	res,
	client,
	linkResolver,
}: PreviewConfig): Promise<void> {
	const previewUrl = await client.resolvePreviewURL({
		linkResolver,
		defaultURL: "/",
	});

	res.redirect(previewUrl);
}
