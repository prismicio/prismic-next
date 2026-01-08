import { revalidateTag } from "next/cache";
import { buildPrismicCacheTag } from "./getPrismicCacheTags";

/**
 * Immediately revalidates a set of Prismic pages given a list of their IDs. The
 * list of IDs typically comes from a Prismic webhook triggered when publishing
 * content.
 *
 * @param ids - A list of Prismic page IDs to revalidate.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/revalidateTag}
 */
export function revalidatePrismicPages(ids: string[]): void {
	for (const id of ids) {
		const tag = buildPrismicCacheTag(id);
		revalidateTag(tag, { expire: 0 });
	}
}
