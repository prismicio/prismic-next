/**
 * Unwraps `io.prismic.preview` to a Content API ref.
 *
 * After toolbar `PreviewCookie.sync` / `upsertPreviewForDomain`, the cookie is
 * `{ [domain]: { preview: string } }`. Returning that jar makes `enableAutoPreviews`
 * / Cache Components send a non-ref (ParsingError / 404). A jar with more than one
 * repository `preview` is ambiguous and is ignored.
 */
export function previewRefFromCookie(cookie: string): string | undefined {
	try {
		const parsed: unknown = JSON.parse(cookie)
		if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
			return
		}

		const previewRefs: string[] = []
		for (const value of Object.values(parsed)) {
			if (
				value !== null &&
				typeof value === "object" &&
				!Array.isArray(value) &&
				"preview" in value &&
				typeof value.preview === "string"
			) {
				previewRefs.push(value.preview)
			}
		}

		return previewRefs.length === 1 ? previewRefs[0] : undefined
	} catch {
		return cookie
	}
}
