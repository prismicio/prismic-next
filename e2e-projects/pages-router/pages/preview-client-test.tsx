import { PrismicPreview } from "@prismicio/next/pages"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import type { JSX } from "react"

export default function Page({
	previewRef,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
	return (
		<>
			<p data-testid="preview-ref">{previewRef ?? "none"}</p>
			<PrismicPreview
				repositoryName="example"
				updatePreviewURL="/api/set-preview-data-test?redirect"
			/>
		</>
	)
}

export const getServerSideProps: GetServerSideProps<{ previewRef: string | null }> = async ({
	previewData,
}) => ({
	props: {
		previewRef:
			typeof previewData === "object" && previewData !== null && "ref" in previewData
				? String(previewData.ref)
				: null,
	},
})
