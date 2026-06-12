import { cacheTagPrismicPages, getPreviewRef } from "@prismicio/next"
import { cacheLife } from "next/cache"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { createClient } from "@/prismicio"

async function fetchPage(uid: string, ref?: string) {
	"use cache"
	const page = await createClient()
		.getByUID("page", uid, { ref })
		.catch(() => notFound())
	cacheTagPrismicPages([page])
	cacheLife(ref ? "minutes" : "max")
	return page
}

export async function generateStaticParams(): Promise<{ uid: string }[]> {
	const pages = await createClient().getAllByType("page")
	return pages.map((page) => ({ uid: page.uid! }))
}

export default async function Page({
	params,
}: {
	params: Promise<{ uid: string }>
}): Promise<JSX.Element> {
	// The preview ref is read outside the cached `fetchPage` and passed in as an
	// argument so it lands in the cache key. `getPreviewRef` short-circuits on
	// Draft Mode, so static generation never reads request data.
	const { uid } = await params
	const page = await fetchPage(uid, await getPreviewRef())

	return <div data-testid="payload">{page.data.payload}</div>
}
