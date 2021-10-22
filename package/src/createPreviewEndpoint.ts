/**
 * TODO
 * Create preview endpoint config
 * Refer to Client types from @prismicio/client (resolvePreviewURL)
 * import nextJS types for req and res
 */

export async function prismicNextPreview({ req, res, Client, linkResolver }) {
	const { token: ref, documentId } = req.query;

	const redirectUrl = await Client(req)
		.getPreviewResolver(ref, documentId)
		.resolve(linkResolver, "/");

	if (!redirectUrl) {
		return res.status(401).json({ message: "Invalid token" });
	}

	res.setPreviewData({ ref });

	// Redirect the user to the share endpoint from same origin. This is
	// necessary due to a Chrome bug:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=696204
	res.redirect(redirectUrl);
}
