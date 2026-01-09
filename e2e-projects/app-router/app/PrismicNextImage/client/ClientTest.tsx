"use client";

import type { JSX } from "react";
import { useState } from "react";
import type { ImageField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

export function ClientTest(props: { field: ImageField }): JSX.Element {
	const { field } = props;

	const [ref, setRef] = useState<Element | null>(null);

	return (
		<p>
			<PrismicNextImage ref={setRef} field={field} />
			<span data-testid="ref">tagname: {ref?.tagName}</span>
		</p>
	);
}
