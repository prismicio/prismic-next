/** Returns `path` if it stays on the current origin, like `/blog?page=2#top`. */
export function getSafePath(path: string | null | undefined): string | undefined {
	if (!path?.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
		return
	}

	const origin = "https://placeholder.invalid"
	const url = new URL(path, origin)
	if (url.origin === origin) {
		return url.href.slice(origin.length)
	}
}
