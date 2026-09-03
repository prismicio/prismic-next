import { expiredPreviewCookieHeaders } from "../lib/expiredPreviewCookies"
import type { NextApiRequestLike, NextApiResponseLike } from "./types"

/** Configuration for `exitPreview()`. */
export type ExitPreviewAPIRouteConfig = {
	/**
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	req?: NextApiRequestLike

	/**
	 * The `res` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	res: NextApiResponseLike
}

/**
 * Ends a Prismic preview session within a Next.js app. This function should be used in an API
 * route.
 *
 * @example
 * 	;```typescript
 * 	// src/pages/api/exit-preview.js
 *
 * 	import { exitPreview } from "@prismicio/next"
 *
 * 	export default function handler(_req, res) {
 * 		return exitPreview({ res })
 * 	}
 * 	```
 */
export function exitPreview(config: ExitPreviewAPIRouteConfig): void {
	config.res.clearPreviewData()

	// `clearPreviewData()` only clears Next.js preview cookies. Expire both
	// leftover `io.prismic.preview` shapes (toolbar Lax, not Secure; and the
	// iframe SameSite=None; Secure write). If either survives,
	// `<PrismicPreview>` calls `start()` → `/api/preview` and preview returns.
	// Do not use `cookies().set` — that is the App Router helper. Do not
	// replace the existing Set-Cookie header from `clearPreviewData()`.
	const existingSetCookie = config.res.getHeader("Set-Cookie")
	const expiredPreviewCookies = expiredPreviewCookieHeaders()
	config.res.setHeader(
		"Set-Cookie",
		existingSetCookie == null
			? expiredPreviewCookies
			: [
					...(Array.isArray(existingSetCookie) ? existingSetCookie : [existingSetCookie]).map(
						String,
					),
					...expiredPreviewCookies,
				],
	)

	// `Cache-Control` header is used to prevent CDN-level caching.
	config.res.setHeader("Cache-Control", "no-store")

	config.res.json({ success: true })

	return
}
