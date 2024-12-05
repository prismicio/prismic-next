import { redirect } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import {
	cookie as prismicCookie,
	type Client,
	type LinkResolverFunction,
} from "@prismicio/client";

import { NextRequestLike } from "./types.js";

export type RedirectToPreviewURLConfig = {
	/** The Prismic client configured for the preview session's repository. */
	// `Pick` is used to use the smallest possible subset of
	// `prismic.Client`. Doing this reduces the surface area for breaking
	// type changes.
	client: Pick<Client, "resolvePreviewURL">;

	/**
	 * The `request` object from a Next.js Route Handler.
	 *
	 * @see Next.js Route Handler docs: \<https://nextjs.org/docs/app/building-your-application/routing/route-handlers\>
	 */
	request: NextRequestLike;

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
};

export async function redirectToPreviewURL(
	config: RedirectToPreviewURLConfig,
): Promise<never> {
	const { client, request, linkResolver, defaultURL = "/" } = config;

	// Set the initial preview cookie. Setting the cookie here is necessary
	// to support unpublished previews. Without setting it here, the page
	// will try to render without the preview cookie, leading to a
	// PrismicNotFound error.
	const previewToken = request.nextUrl.searchParams.get("token") ?? undefined;
	if (previewToken) {
		const cookieJar = await cookies();
		cookieJar.set(prismicCookie.preview, previewToken);
	}

	const previewURL = await client.resolvePreviewURL({
		linkResolver,
		defaultURL,
		previewToken,
	});

	(await draftMode()).enable();

	redirect(previewURL);
}
