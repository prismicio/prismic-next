import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@prismicio/client";
import { LinkResolverFunction } from "@prismicio/helpers";

export type PreviewConfig = {
	req: {
		query: NextApiRequest["query"];
	};
	res: {
		redirect: NextApiResponse["redirect"];
	};
	client: Client;
	linkResolver?: LinkResolverFunction;
	defaultURL?: string;
};

type PrismicNextQuery = {
	documentId: string;
	token: string;
};

const isPrismicNextQuery = (
	query: NextApiRequest["query"],
): query is PrismicNextQuery =>
	typeof query.documentId === "string" && typeof query.token === "string";

export async function redirectToPreviewURL({
	req,
	res,
	client,
	linkResolver,
	defaultURL = "/",
}: PreviewConfig): Promise<void> {
	if (isPrismicNextQuery(req.query)) {
		const { documentId, token } = req.query;
		const previewUrl = await client.resolvePreviewURL({
			linkResolver,
			defaultURL,
			documentID: documentId,
			previewToken: token,
		});

		res.redirect(previewUrl);
	}

	res.redirect(defaultURL);
}
