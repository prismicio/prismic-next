import { PrismicPreview } from "@prismicio/next"
import type { JSX, ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
	return (
		<PrismicPreview
			repositoryName="example"
			updatePreviewURL="/api/get-preview-ref-test?mode=bootstrap"
		>
			{children}
		</PrismicPreview>
	)
}
