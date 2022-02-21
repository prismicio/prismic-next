/**
 * Accepts the host string and returns the host name.
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
	try {
		const parsed = JSON.parse(decodeURIComponent(previewRef));
		const keys = Object.keys(parsed);
		const domainKey = keys.find((key) => /\.prismic\.io$/.test(key));

		if (domainKey) {
			return extractFirstSubdomain(domainKey);
		} else {
			return undefined;
		}
	} catch {
		return undefined;
	}
};

/**
 * Formats preview ref to URL and returns first subdomain
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
