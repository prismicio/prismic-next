"use client";

import { useState } from "react";
import { PrismicNextLink } from "@prismicio/next";

export default function Page() {
	const [ref, setRef] = useState<HTMLAnchorElement | null>(null);

	return (
		<PrismicNextLink href="" ref={setRef} data-testid="ref">
			tagname: {ref?.tagName}
		</PrismicNextLink>
	);
}
