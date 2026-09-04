import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import type { JSX } from "react"

type PreviewData = { ref?: unknown } | string | undefined

export default function Page({
	previewRef,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
	return <pre data-testid="preview-ref">{JSON.stringify(previewRef)}</pre>
}

export const getServerSideProps: GetServerSideProps<{ previewRef: unknown }> = async ({
	previewData,
}) => {
	const data = previewData as PreviewData
	const previewRef =
		typeof data === "object" && data !== null && "ref" in data ? (data.ref ?? null) : null

	return { props: { previewRef } }
}
