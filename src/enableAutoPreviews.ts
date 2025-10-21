import { type Client, cookie as prismicCookie } from "@prismicio/client";

/** Configuration for `enableAutoPreviews()`. */
export type EnableAutoPreviewsConfig = {
	/** Prismic client with which automatic previews will be enabled. */
	// `Pick` is used to use the smallest possible subset of
	// `prismic.Client`. Doing this reduces the surface area for breaking
	// type changes.
	client: Pick<Client, "queryContentFromRef" | "enableAutoPreviewsFromReq">;
};

/**
 * Configures a Prismic client to automatically query draft content during a
 * preview session in Next.js App Router.
 *
 * @example
 *
 * ```typescript
 * import * as prismic from "@prismicio/client";
 * import { enableAutoPreviews } from "@prismicio/next";
 *
 * export function createClient() {
 * 	const client = prismic.createClient("your-repo-name");
 *
 * 	enableAutoPreviews({ client });
 *
 * 	return client;
 * }
 * ```
 *
 * @param config - Configuration object containing the Prismic client.
 *
 * @see Prismic preview setup: https://prismic.io/docs/previews-nextjs
 */
export function enableAutoPreviews(config: EnableAutoPreviewsConfig): void {
	// We use a function value so the cookie is checked on every
	// request. We don't have a static value to read from.
	config.client.queryContentFromRef(async () => {
		// Need this to avoid the following Next.js build-time error:
		// You're importing a component that needs next/headers. That only works
		// in a Server Component which is not supported in the pages/ directory.
		const { cookies, draftMode } = await import("next/headers");

		let isDraftModeEnabled = false;
		try {
			isDraftModeEnabled = (await draftMode()).isEnabled;
		} catch {
			// `draftMode()` may have been called in a palce that
			// does not have access to its async storage. This
			// occurs in places like `generateStaticParams()`. We
			// can ignore this case.
			return;
		}
		if (!isDraftModeEnabled) {
			return;
		}

		const cookie = (await cookies()).get(prismicCookie.preview)?.value;
		if (!cookie) {
			return;
		}

		const isActiveCookie = cookie.includes("websitePreviewId=");
		if (!isActiveCookie) {
			return;
		}

		return cookie;
	});
}
