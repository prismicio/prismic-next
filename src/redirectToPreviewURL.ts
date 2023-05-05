import { redirect } from "next/navigation";
import type * as prismic from "@prismicio/client";

import { checkIsNextRequest } from "./lib/checkIsNextRequest";

import {
	FlexibleNextApiRequestLike,
	FlexibleNextRequestLike,
	NextApiResponseLike,
} from "./types";

/**
 * Preview config for enabling previews with redirectToPreviewURL
 */
export type RedirectToPreviewURLConfig = (
	| FlexibleNextRequestLike
	| (FlexibleNextApiRequestLike & {
			/**
			 * The `res` object from a Next.js API route.
			 *
			 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
			 */
			res: NextApiResponseLike;
	  })
) & {
	/**
	 * The Prismic client configured for the preview session's repository.
	 */
	// `Pick` is used to use the smallest possible subset of
	// `prismic.Client`. Doing this reduces the surface area for breaking
	// type changes.
	client: Pick<
		prismic.Client,
		"enableAutoPreviewsFromReq" | "resolvePreviewURL"
	>;

	/**
	 * A Link Resolver used to resolve the previewed document's URL.
	 *
	 * @see To learn more about Link Resolver: {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver}
	 */
	linkResolver?: prismic.LinkResolverFunction;

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
	 * The API route is unable to detect the app's `basePath` automatically. It
	 * must be provided to `redirectToPreviewURL()` manually.
	 */
	basePath?: string;
};

/**
 * Redirects a user to the URL of a previewed Prismic document from within a
 * Next.js API route.
 */
export async function redirectToPreviewURL(
	config: RedirectToPreviewURLConfig,
): Promise<void> {
	const basePath = config.basePath || "";
	const request = "request" in config ? config.request : config.req;
	const isNextRequest = checkIsNextRequest(request);

	config.client.enableAutoPreviewsFromReq(request);

	const previewUrl = await config.client.resolvePreviewURL({
		linkResolver: config.linkResolver,
		defaultURL: config.defaultURL || "/",
	});

	if (isNextRequest) {
		redirect(basePath + previewUrl);
	} else {
		if (!("res" in config)) {
			throw new Error(
				"[redirectToPreviewURL] The `res` object from the API route must be provided to `redirectToPreviewURL()`.",
			);
		}

		config.res.redirect(basePath + previewUrl);

		return;
	}
}
