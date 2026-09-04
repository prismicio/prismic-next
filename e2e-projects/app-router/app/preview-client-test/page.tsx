import { getPreviewRef, PrismicPreview } from "@prismicio/next"
import { draftMode } from "next/headers"
import type { JSX } from "react"

export default async function Page(): Promise<JSX.Element> {
	return (
		<>
			<p data-testid="draft-mode">{String((await draftMode()).isEnabled)}</p>
			<p data-testid="preview-ref">{(await getPreviewRef()) ?? "none"}</p>
			<PrismicPreview
				repositoryName="example"
				updatePreviewURL="/api/get-preview-ref-test?mode=bootstrap"
			/>
		</>
	)
}
