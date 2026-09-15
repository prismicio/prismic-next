import { getPreviewRef } from "@prismicio/next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

import { createClient } from "@/prismicio"

export default async function Page({
	params,
}: {
	params: Promise<{ uid: string }>
}): Promise<JSX.Element> {
	const { uid } = await params

	const client = await createClient()
	const page = await client.getByUID("page", uid).catch(() => notFound())

	return (
		<>
			<div data-testid="payload">{page.data.payload}</div>
			<div data-testid="preview-ref">{await getPreviewRef()}</div>
		</>
	)
}
