import { NextApiRequest } from "next";
import { PreviewConfig } from "./";

type PrismicNextQuery = {
	documentId: string;
	token: string;
};

const isPrismicNextQuery = (
	query: NextApiRequest["query"],
): query is PrismicNextQuery =>
	typeof query.documentId === "string" && typeof query.token === "string";

/**
 * @name redirectToPreviewURL
 * @param PreviewConfig
 * @description Redirects to preview URL based on whether or not it's a Prismic query or not
 */
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
