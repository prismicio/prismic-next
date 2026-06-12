import * as prismic from "@prismicio/client"
import { cacheTagPrismicPages } from "@prismicio/next"
import { cacheLife } from "next/cache"

/**
 * Fetches a `page` document within a Cache Components `use cache` scope. The
 * preview ref is passed in as an argument so it becomes part of the cache key.
 */
export async function fetchPage(
	repositoryName: string,
	uid: string,
	previewRef?: string,
): Promise<prismic.PrismicDocument> {
	"use cache"
	cacheLife("max")

	const client = prismic.createClient(repositoryName, {
		routes: [{ type: "page", path: "/:uid" }],
	})
	const page = await client.getByUID("page", uid, { ref: previewRef })
	cacheTagPrismicPages([page])

	return page
}
