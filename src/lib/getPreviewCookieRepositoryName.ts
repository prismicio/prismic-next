/**
 * Extracts preview reference repo name from stringified Prismic preview cookie
 *
 * @param previewCookie - The Prismic preview cookie.
 *
 * @returns The repository name for the Prismic preview cookie. If the cookie
 *   represents an inactive preview session, `undefined` will be returned.
 */
export const getPreviewCookieRepositoryName = (
	previewCookie: string,
): string | undefined => {
	return (decodeURIComponent(previewCookie).match(/"(.+).prismic.io"/) ||
		[])[1];
};
