import { getPreviewRef } from "@prismicio/next"
import { notFound } from "next/navigation"
import type { JSX } from "react"

export default async function Page(): Promise<JSX.Element> {
	const ref = await getPreviewRef()
	if (!ref) notFound()
	return <p data-testid="preview-ref">{ref}</p>
}
