// Add Next.js-specific fetchOptions to `@prismicio/client`.
declare module "@prismicio/client" {
	interface RequestInitLike {
		next?: RequestInit["next"]
	}
}

/**
 * The minimal set of properties needed from `next`'s `NextRequest` type.
 *
 * This request type is only compatible with Route Handlers defined in the `app` directory.
 */
export type NextRequestLike = {
	headers: {
		get(name: string): string | null
	}
	url: string
	nextUrl: {
		pathname: string
		searchParams: {
			get(name: string): string | null
		}
	}
}
