import { draftMode, cookies } from "next/headers";
import { type Client, cookie as prismicCookie } from "@prismicio/client";

/**
 * Configuration for `enableAutoPreviews`.
 */
export type EnableAutoPreviewsConfig = {
	/**
	 * Prismic client with which automatic previews will be enabled.
	 */
	// `Pick` is used to use the smallest possible subset of
	// `prismic.Client`. Doing this reduces the surface area for breaking
	// type changes.
	client: Pick<Client, "queryContentFromRef" | "enableAutoPreviewsFromReq">;
};

/**
 * Configures a Prismic client to automatically query draft content during a
 * preview session.
 *
 * @param config - Configuration for the function.
 */
export function enableAutoPreviews(config: EnableAutoPreviewsConfig): void {
	// We use a function value so the cookie is checked on every
	// request. We don't have a static value to read from.
	config.client.queryContentFromRef(async () => {
		const isDraftModeEnabled = (await draftMode()).isEnabled;
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
