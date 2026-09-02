import type { PrismicDocument } from "@prismicio/client"
// A namespace import keeps Node.js from failing to load the ESM build on
// Next.js 15, where `cacheTag` does not exist yet.
import * as nextCache from "next/cache"

import { getPrismicCacheTags } from "./getPrismicCacheTags"

/**
 * Tags the current cache entry with cache tags for a set of Prismic pages so they can be
 * revalidated when their content changes.
 *
 * Linked documents (via content relationships) are tagged as well, so the cache entry is
 * revalidated when any of its nested documents change.
 *
 * @param pages - A set of Prismic pages used to tag the cache entry.
 * @experimental
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/cacheTag}
 */
export function cacheTagPrismicPages(pages: PrismicDocument[]): void {
	nextCache.cacheTag(...getPrismicCacheTags(pages))
}
