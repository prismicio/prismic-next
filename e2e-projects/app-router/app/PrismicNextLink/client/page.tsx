"use client";

import type { JSX } from "react";
import { useState } from "react";
import { PrismicNextLink } from "@prismicio/next";

export default function Page(): JSX.Element {
	const [ref, setRef] = useState<HTMLAnchorElement | null>(null);

	return (
		<PrismicNextLink ref={setRef} href="" data-testid="ref">
			tagname: {ref?.tagName}
		</PrismicNextLink>
	);
}
