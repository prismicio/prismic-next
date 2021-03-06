import type { Client } from "@prismicio/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { LinkResolverFunction } from "@prismicio/helpers";

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
): query is PrismicNextQuery => {
	return (
		typeof query.documentId === "string" && typeof query.token === "string"
	);
};

/**
 * Preview config for enabling previews with redirectToPreviewURL
 */
export type RedirectToPreviewURLConfig<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TLinkResolverFunction extends LinkResolverFunction<any> = LinkResolverFunction,
> = {
	/**
	 * The `req` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	req: {
		query: NextApiRequest["query"];
	};

	/**
	 * The `res` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	res: {
		redirect: NextApiResponse["redirect"];
	};

	/**
	 * The Prismic client configured for the preview session's repository.
	 */
	client: Client;

	/**
	 * A Link Resolver used to resolve the previewed document's URL.
	 *
	 * @see To learn more about Link Resolver: {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver}
	 */
	linkResolver?: TLinkResolverFunction;

	/**
	 * The default redirect URL if a URL cannot be determined for the previewed document.
	 *
	 * **Note**: If you `next.config.js` file contains a `basePath`, the
	 * `defaultURL` option must _not_ include it. Instead, provide the `basePath`
	 * property using the `basePath` option.
	 */
	defaultURL?: string;

	/**
	 * The `basePath` for the Next.js app as it is defined in `next.config.js`.
	 * This option can be omitted if the app does not have a `basePath`.
	 *
	 * @remarks
	 * The API route is unable to detect the app's `basePath` automatically. It
	 * must be provided to `redirectToPreviewURL()` manually.
	 */
	basePath?: string;
};

/**
 * Redirects a user to the URL of a previewed Prismic document from within a
 * Next.js API route.
 */
export async function redirectToPreviewURL<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TLinkResolverFunction extends LinkResolverFunction<any>,
>(config: RedirectToPreviewURLConfig<TLinkResolverFunction>): Promise<void> {
	const defaultURL = config.defaultURL || "/";
	const basePath = config.basePath || "";

	if (isPrismicNextQuery(config.req.query)) {
		const previewUrl = await config.client.resolvePreviewURL({
			linkResolver: config.linkResolver,
			defaultURL,
			documentID: config.req.query.documentId,
			previewToken: config.req.query.token,
		});

		config.res.redirect(basePath + previewUrl);

		return;
	}

	config.res.redirect(basePath + defaultURL);
}
