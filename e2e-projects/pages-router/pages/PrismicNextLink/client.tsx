import { PrismicNextLink } from "@prismicio/next/pages"
import type { JSX } from "react"
import { useState } from "react"

export default function Page(): JSX.Element {
	const [ref, setRef] = useState<HTMLAnchorElement | null>(null)

	return (
		<PrismicNextLink ref={setRef} href="" data-testid="ref">
			tagname: {ref?.tagName}
		</PrismicNextLink>
	)
}
