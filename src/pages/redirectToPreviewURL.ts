import type { LinkResolverFunction, Client } from "@prismicio/client";

import type { NextApiRequestLike, NextApiResponseLike } from "./types.js";

export type RedirectToPreviewURLConfig = {
	/**
	 * The Prismic client configured for the preview session's repository.
	 */
	// `Pick` is used to use the smallest possible subset of
	// `prismic.Client`. Doing this reduces the surface area for breaking
	// type changes.
	client: Pick<Client, "resolvePreviewURL">;

	/**
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/pages/building-your-application/routing/api-routes\>
	 */
	req: NextApiRequestLike;

	/**
	 * The `res` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/pages/building-your-application/routing/api-routes\>
	 */
	res: NextApiResponseLike;

	/**
	 * A Link Resolver used to resolve the previewed document's URL.
	 *
	 * @see To learn more about Link Resolver: {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver}
	 */
	linkResolver?: LinkResolverFunction;

	/**
	 * The default redirect URL if a URL cannot be determined for the previewed
	 * document.
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
	 * The Router Handler or API route is unable to detect the app's `basePath`
	 * automatically. It must be provided to `redirectToPreviewURL()` manually.
	 */
	basePath?: string;
};

export async function redirectToPreviewURL(
	config: RedirectToPreviewURLConfig,
): Promise<void> {
	const {
		client,
		req,
		res,
		linkResolver,
		defaultURL = "/",
		basePath = "",
	} = config;

	const previewToken = req.query.token?.toString();

	const previewURL = await client.resolvePreviewURL({
		linkResolver,
		defaultURL,
		previewToken,
	});

	res.redirect(basePath + previewURL);

	return;
}
