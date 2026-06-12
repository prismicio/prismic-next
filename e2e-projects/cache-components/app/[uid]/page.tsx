import { getPreviewRef } from "@prismicio/next"
import { cookies } from "next/headers"
import { Suspense, type JSX } from "react"

import { fetchPage } from "@/prismicio"

export default function Page({ params }: { params: Promise<{ uid: string }> }): JSX.Element {
	// The preview ref and repository name are read outside the cached
	// `fetchPage` and passed in as arguments, so they land in the cache key.
	// Reading them here keeps the dynamic work inside a Suspense boundary, as
	// Cache Components requires.
	return (
		<Suspense>
			<Payload params={params} />
		</Suspense>
	)
}

async function Payload({ params }: { params: Promise<{ uid: string }> }): Promise<JSX.Element> {
	const { uid } = await params
	const repositoryName = (await cookies()).get("repository-name")?.value
	const page = await fetchPage(repositoryName!, uid, await getPreviewRef())

	return <div data-testid="payload">{page.data.payload}</div>
}
