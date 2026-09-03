import { expiredPreviewCookieHeaders } from "./lib/expiredPreviewCookies"

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
	// Need this to avoid the following Next.js build-time error:
	// You're importing a component that needs next/headers. That only works
	// in a Server Component which is not supported in the pages/ directory.
	const { draftMode } = await import("next/headers")

	;(await draftMode()).disable()

	// `redirectToPreviewURL` writes SameSite=None; Secure. The toolbar may
	// leave SameSite=Lax (not Secure). Those are different cookies to Chrome.
	// Expire both on the Response. Do not use `cookies().set` / `delete()`:
	// ResponseCookies is name-keyed, so a second `io.prismic.preview` overwrites
	// the first and the Lax leftover survives.
	const headers = new Headers({
		"Cache-Control": "no-store",
	})
	for (const setCookie of expiredPreviewCookieHeaders()) {
		headers.append("Set-Cookie", setCookie)
	}

	return new Response(JSON.stringify({ success: true }), { headers })
}
