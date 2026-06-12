import { revalidatePrismicPages } from "@prismicio/next"
import type { NextRequest } from "next/server"

export function GET(request: NextRequest): Response {
	const id = request.nextUrl.searchParams.get("id")
	if (id) {
		revalidatePrismicPages([id])
	}

	// `Cache-Control` header is used to prevent CDN-level caching.
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			"Cache-Control": "no-store",
		},
	})
}
