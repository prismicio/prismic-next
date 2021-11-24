import { NextApiResponse } from "next";
import { Client } from "@prismicio/client";
import { LinkResolverFunction } from "@prismicio/helpers";

export type PreviewConfig = {
	req: {
		query: {
			documentId: string;
			token: string;
		};
	};
	res: NextApiResponse;
	client: Client;
	linkResolver: LinkResolverFunction;
};

export async function redirectToPreviewURL({
	req,
	res,
	client,
	linkResolver,
}: PreviewConfig): Promise<void> {
	const { documentId, token } = req.query;
	const previewUrl = await client.resolvePreviewURL({
		linkResolver,
		defaultURL: "/",
		documentID: documentId,
		previewToken: token,
	});

	res.redirect(previewUrl);
}
