import { cookie as prismicCookie } from "@prismicio/client"

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
	const { cookies, draftMode } = await import("next/headers")

	;(await draftMode()).disable()

	// `redirectToPreviewURL` writes the preview cookie, so `exitPreview`
	// clears it to close the preview-cookie loop.
	//
	// Do not use `cookies().delete()`: on Next.js 13.4.5–15 it omits
	// Secure/SameSite, so Chrome will not replace the iframe cookie
	// (SameSite=None; Secure). Overwrite with an expired cookie that
	// matches the write attributes instead.
	;(await cookies()).set(prismicCookie.preview, "", {
		path: "/",
		sameSite: "none",
		secure: true,
		httpOnly: false,
		expires: new Date(0),
	})

	// `Cache-Control` header is used to prevent CDN-level caching.
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			"Cache-Control": "no-store",
		},
	})
}
