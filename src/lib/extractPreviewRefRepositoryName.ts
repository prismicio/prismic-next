/**
 * Returns the repository name from an object-style Prismic ref.
 *
 * @param host - Host string
 */
const extractFirstSubdomain = (host: string): string => host.split(".")[0];

/**
 * Parses ref object from cookie and returns proper preview link
 *
 * @param previewRef - Prismic Preview reference
 */
const extractRepositoryNameFromObjectRef = (
	previewRef: string,
): string | undefined => {
	const parsed = JSON.parse(decodeURIComponent(previewRef));
	const keys = Object.keys(parsed);
	const domainKey = keys.find((key) => /\.prismic\.io$/.test(key));

	if (domainKey) {
		return extractFirstSubdomain(domainKey);
	} else {
		return undefined;
	}
};

/**
 * Returns the repository name from a URL-style Prismic ref.
 *
 * @param previewRef - Preview ref from getCookie()
 */
const extractRepositoryNameFromURLRef = (
	previewRef: string,
): string | undefined => {
	try {
		const url = new URL(previewRef);

		return extractFirstSubdomain(url.host);
	} catch {
		return undefined;
	}
};

/**
 * Extracts preview reference repo name from stringified Prismic preview cookie
 *
 * @param previewRef - Preview Reference
 */
export const extractPreviewRefRepositoryName = (
	previewRef: string,
): string | undefined => {
	return (
		extractRepositoryNameFromObjectRef(previewRef) ||
		extractRepositoryNameFromURLRef(previewRef)
	);
};
