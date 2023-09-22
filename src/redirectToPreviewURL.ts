import { redirect } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import * as prismic from "@prismicio/client";

import {
	NextApiRequestLike,
	NextApiResponseLike,
	NextRequestLike,
} from "./types";

type RedirectToPreviewURLConfigBase = {
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
	 * The Router Handler or API route is unable to detect the app's `basePath`
	 * automatically. It must be provided to `redirectToPreviewURL()` manually.
	 */
	basePath?: string;
};

export type RedirectToPreviewURLRouteHandlerConfig =
	RedirectToPreviewURLConfigBase & {
		/**
		 * The `request` object from a Next.js Route Handler.
		 *
		 * @see Next.js Route Handler docs: \<https://nextjs.org/docs/app/building-your-application/routing/route-handlers\>
		 */
		request: NextRequestLike;
	};

export type RedirectToPreviewURLAPIEndpointConfig =
	RedirectToPreviewURLConfigBase & {
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
	};

export type RedirectToPreviewURLConfig =
	| RedirectToPreviewURLRouteHandlerConfig
	| RedirectToPreviewURLAPIEndpointConfig;

export async function redirectToPreviewURL(
	config: RedirectToPreviewURLRouteHandlerConfig,
): Promise<never>;
export async function redirectToPreviewURL(
	config: RedirectToPreviewURLAPIEndpointConfig,
): Promise<void>;
export async function redirectToPreviewURL(
	config: RedirectToPreviewURLConfig,
): Promise<never | void> {
	const basePath = config.basePath || "";
	const request = "request" in config ? config.request : config.req;

	config.client.enableAutoPreviewsFromReq(request);

	const previewUrl = await config.client.resolvePreviewURL({
		linkResolver: config.linkResolver,
		defaultURL: config.defaultURL || "/",
	});

	if ("nextUrl" in request) {
		draftMode().enable();

		// Set the initial preview cookie, if available.
		// Setting the cookie here is necessary to support unpublished
		// previews. Without setting it here, the page will try to
		// render without the preview cookie, leading to a
		// PrismicNotFound error.
		const previewCookie = request.nextUrl.searchParams.get("token");
		if (previewCookie) {
			cookies().set(prismic.cookie.preview, previewCookie);
		}

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
