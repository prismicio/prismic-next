import { PrismicDocument } from "@prismicio/client";
import { cacheTag } from "next/cache";
import { getPrismicCacheTags } from "./getPrismicCacheTags";

export function cacheTagPrismicPages(pages: PrismicDocument[]) {
	cacheTag(...getPrismicCacheTags(pages));
}
