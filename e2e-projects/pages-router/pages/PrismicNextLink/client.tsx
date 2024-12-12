import { useState } from "react";
import { PrismicNextLink } from "@prismicio/next/pages";

export default function Page() {
	const [ref, setRef] = useState<HTMLAnchorElement | null>(null);

	return (
		<PrismicNextLink ref={setRef} href="" data-testid="ref">
			tagname: {ref?.tagName}
		</PrismicNextLink>
	);
}
