import {
	expiredDraftModeCookieHeaders,
	expiredPreviewCookieHeaders,
} from "./lib/expiredPreviewCookies"

/**
 * Ends a Prismic preview session within a Next.js app. This function should be used in a Router
 * Handler.
 *
 * @example
 * 	;```typescript
 * 	// src/app/api/exit-preview/route.js
 *
 * 	import { exitPreview } from "@prismicio/next"
 *
 * 	export async function GET() {
 * 		return await exitPreview()
 * 	}
 * 	```
 */
export async function exitPreview(): Promise<Response> {
	// Do not call `cookies()` or `draftMode().disable()`. ResponseCookies is
	// name-keyed: `appendMutableCookies` rebuilds Set-Cookie by name and drops
	// the extra Lax expire. Emit every expire on the Response instead:
	// toolbar Lax + iframe None; Secure for `io.prismic.preview`, and both
	// shapes of `__prerender_bypass` that `disable()` would have cleared.
	const headers = new Headers({
		"Cache-Control": "no-store",
	})
	for (const setCookie of [...expiredPreviewCookieHeaders(), ...expiredDraftModeCookieHeaders()]) {
		headers.append("Set-Cookie", setCookie)
	}

	return new Response(JSON.stringify({ success: true }), { headers })
}
