import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import type { JSX } from "react"

type PreviewData = { ref?: unknown } | string | undefined

function previewRefFromPreviewData(previewData: unknown): unknown {
	const data = previewData as PreviewData
	return typeof data === "object" && data !== null && "ref" in data ? (data.ref ?? null) : null
}

export default function Page({
	previewRef,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
	return <pre data-testid="preview-ref">{JSON.stringify(previewRef)}</pre>
}

export const getServerSideProps: GetServerSideProps<{ previewRef: unknown }> = async ({
	previewData,
	req,
	res,
}) => {
	const previewRef = previewRefFromPreviewData(previewData)

	if (req.headers.accept?.includes("application/json")) {
		res.setHeader("Content-Type", "application/json")
		res.end(JSON.stringify({ previewRef }))
		return { props: { previewRef } }
	}

	return { props: { previewRef } }
}
