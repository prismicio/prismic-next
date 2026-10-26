/** Returns `path` if it stays on the current origin, like `/blog?page=2#top`. */
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

	// Dot segments can normalize `/a/..//evil.com` to `//evil.com`, which leaves the origin.
	const safePath = url.href.slice(origin.length)
	if (url.origin === origin && !safePath.startsWith("//")) {
		return safePath
	}
}
