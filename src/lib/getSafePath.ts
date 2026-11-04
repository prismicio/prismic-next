/**
 * Returns `path` if it stays on the current origin, like `/blog?page=2#top`. It comes from
 * `location`, so it already includes `basePath`.
 */
export function getSafePath(path: string | null | undefined): string | undefined {
	if (!path?.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
		return
	}

	const origin = "https://placeholder.invalid"
	let url: URL
	try {
		url = new URL(path, origin)
	} catch {
		return
	}
	const safePath = url.href.slice(origin.length)
	// Normalizing can create `//`, like with `/.//example.com`.
	if (url.origin === origin && !safePath.startsWith("//")) {
		return safePath
	}
}
