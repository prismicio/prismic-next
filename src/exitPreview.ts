/**
 * Ends a Prismic preview session within a Next.js app. This function should be
 * used in a Router Handler.
 *
 * @example
 *
 * ```typescript
 * // src/app/api/exit-preview/route.js
 *
 * import { exitPreview } from "@prismicio/next";
 *
 * export async function GET() {
 * 	return await exitPreview();
 * }
 * ```
 */
export async function exitPreview(): Promise<Response> {
	// Need this to avoid the following Next.js build-time error:
	// You're importing a component that needs next/headers. That only works
	// in a Server Component which is not supported in the pages/ directory.
	const { draftMode } = await import("next/headers");

	(await draftMode()).disable();

	// `Cache-Control` header is used to prevent CDN-level caching.
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			"Cache-Control": "no-store",
		},
	});
}
