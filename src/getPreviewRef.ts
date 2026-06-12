import { cookie as prismicCookie } from "@prismicio/client"

/**
 * Reads the Prismic preview ref for the current request when an active preview
 * session exists.
 *
 * This is the read-side counterpart to `redirectToPreviewURL`, which writes the
 * preview cookie. Use it with Next.js Cache Components to read the ref _outside_
 * a cached function and pass it _in_ as an argument so it becomes part of the
 * cache key:
 *
 * @example
 * 	;```typescript
 * 	import { getPreviewRef } from "@prismicio/next"
 *
 * 	const page = await fetchPage(uid, await getPreviewRef())
 * 	```
 *
 * @returns The active preview ref, or `undefined` if no preview session is active.
 */
export async function getPreviewRef(): Promise<string | undefined> {
	// Need this to avoid the following Next.js build-time error:
	// You're importing a component that needs next/headers. That only works
	// in a Server Component which is not supported in the pages/ directory.
	const { cookies, draftMode } = await import("next/headers")

	let isDraftModeEnabled = false
	try {
		isDraftModeEnabled = (await draftMode()).isEnabled
	} catch {
		// `draftMode()` may have been called in a place that
		// does not have access to its async storage. This
		// occurs in places like `generateStaticParams()`. We
		// can ignore this case.
		return
	}
	if (!isDraftModeEnabled) {
		return
	}

	const cookie = (await cookies()).get(prismicCookie.preview)?.value
	if (!cookie) {
		return
	}

	const isActiveCookie = cookie.includes("websitePreviewId=")
	if (!isActiveCookie) {
		return
	}

	return cookie
}
