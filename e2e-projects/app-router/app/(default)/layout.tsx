import { PrismicPreview } from "@prismicio/next"
import type { JSX, ReactNode } from "react"

import { createClient } from "@/prismicio"

export default async function Layout({ children }: { children: ReactNode }): Promise<JSX.Element> {
	const client = await createClient()

	return (
		<>
			{children}
			<PrismicPreview repositoryName={client.repositoryName} />
		</>
	)
}
