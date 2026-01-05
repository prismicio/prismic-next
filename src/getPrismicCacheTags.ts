import { PrismicDocument } from "@prismicio/client";

const CACHE_TAG_PREFIX = "prismic/";

/**
 * Generates cache tags for a set of Prismic pages. Tags for linked pages (e.g.
 * a content relationship) are included to ensure all related content can be
 * revalidated.
 *
 * @param pages - A set of Prismic pages used to tag the function.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/cacheTag}
 */
export function getPrismicCacheTags(pages: PrismicDocument[]): string[] {
	const ids = [...new Set(getPrismicDocumentIDs(pages))];
	return ids.map((id) => buildPrismicCacheTag(id));
}

export function buildPrismicCacheTag(id: string): string {
	return `${CACHE_TAG_PREFIX}${id}`;
}

function getPrismicDocumentIDs(input: unknown): string[] {
	if (typeof input !== "object" || input == null) return [];

	if (Array.isArray(input))
		return input.flatMap((item) => getPrismicDocumentIDs(item));

	if ("id" in input && typeof input.id === "string") {
		// Document
		// Content relationship or link
		if (
			("href" in input &&
				typeof input.href === "string" &&
				input.href.includes("/api/v2/documents/search?")) ||
			("link_type" in input && input.link_type === "Document")
		) {
			if (
				"data" in input &&
				typeof input.data === "object" &&
				input.data !== null
			) {
				return [input.id, ...getPrismicDocumentIDs(input.data)];
			} else {
				return [input.id];
			}
		}
	}

	return Object.values(input).flatMap((input) => getPrismicDocumentIDs(input));
}
