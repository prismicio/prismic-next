import { cookie as prismicCookie } from "@prismicio/client"

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
	config.res.appendHeader(
		"Set-Cookie",
		[prismicCookie.preview, prismicCookie.previewSession].map(
			(name) => `${name}=; Path=/; Expires=${new Date(0).toUTCString()}; SameSite=None; Secure`,
		),
	)

	// `Cache-Control` header is used to prevent CDN-level caching.
	config.res.setHeader("Cache-Control", "no-store")

	config.res.json({ success: true })

	return
}
