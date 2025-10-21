import type { LinkResolverFunction, Client } from "@prismicio/client";

import type { NextApiRequestLike, NextApiResponseLike } from "./types";

export type RedirectToPreviewURLConfig = {
	/** The Prismic client configured for the preview session's repository. */
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
	 * @see Link Resolver documentation: https://prismic.io/docs/route-resolver
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

/**
 * Redirects to a preview URL for a Prismic document in a Next.js Pages Router API route.
 *
 * @param config - Configuration object containing the Prismic client, request,
 *   response, and optional link resolver.
 *
 * @example
 *
 * ```typescript
 * // src/pages/api/preview.ts
 * import { redirectToPreviewURL } from "@prismicio/next/pages";
 * import { createClient } from "@/prismicio";
 *
 * export default async function handler(req, res) {
 *   const client = createClient({ req });
 *
 *   await redirectToPreviewURL({ client, req, res });
 * }
 * ```
 *
 * @see Prismic preview setup: https://prismic.io/docs/previews-nextjs
 */
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
