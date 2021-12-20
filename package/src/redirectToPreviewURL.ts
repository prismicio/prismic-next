import { NextApiRequest } from "next";
import { PreviewConfig } from "./";

type PrismicNextQuery = {
	documentId: string;
	token: string;
};

/**
 * Determines if a query object from a Next.js API route request contains
 * Prismic preview data.
 *
 * @param query - Query object to check.
 *
 * @returns `true` if `query` contains Prismic preview data, `false` otherwise.
 */
const isPrismicNextQuery = (
	query: NextApiRequest["query"],
): query is PrismicNextQuery =>
	typeof query.documentId === "string" && typeof query.token === "string";

/**
 * Redirects a user to the URL of a previewed Prismic document from within a
 * Next.js API route.
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
