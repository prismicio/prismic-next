import { cookie } from "@prismicio/client"

import { previewRefFromCookie } from "../lib/previewRefFromCookie"
import type { NextApiRequestLike, NextApiResponseLike } from "./types"

/** Configuration for `setPreviewData`. */
export type SetPreviewDataConfig = {
	/**
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	req: NextApiRequestLike

	/**
	 * The `res` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	res: NextApiResponseLike
}

/** Set Prismic preview data for Next.js's Preview Mode. */
export function setPreviewData({ req, res }: SetPreviewDataConfig): void {
	// Only unwrap the cookie. Query tokens, including arrays, stay as-is.
	const previewCookie = req.cookies[cookie.preview]
	const ref = req.query.token || (previewCookie && previewRefFromCookie(previewCookie))
	if (ref) {
		res.setPreviewData({ ref })

		// Next.js uses Lax preview cookies in development. Preserve its
		// signed/encrypted values and all other attributes, but allow both
		// cookies to reach the site inside the editor's cross-site iframe.
		const setCookie = res.getHeader("Set-Cookie")
		if (typeof setCookie === "string" || Array.isArray(setCookie)) {
			res.setHeader(
				"Set-Cookie",
				(typeof setCookie === "string" ? [setCookie] : setCookie).map((header) =>
					/^__(?:prerender_bypass|next_preview_data)=/.test(header)
						? `${header.replace(/;\s*(?:Secure|SameSite=[^;]*)(?=;|$)/gi, "")}; SameSite=None; Secure`
						: header,
				),
			)
		}
	}
}
