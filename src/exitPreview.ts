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
	const { cookies } = await import("next/headers")

	const cookieJar = await cookies()
	cookieJar.delete({ name: "__prerender_bypass", sameSite: "none", secure: true })
	cookieJar.delete({ name: prismicCookie.preview, sameSite: "none", secure: true })

	// `Cache-Control` header is used to prevent CDN-level caching.
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			"Cache-Control": "no-store",
		},
	})
}
