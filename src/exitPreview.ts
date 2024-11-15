import { draftMode } from "next/headers";

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
	(await draftMode()).disable();

	// `Cache-Control` header is used to prevent CDN-level caching.
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			"Cache-Control": "no-store",
		},
	});
}
