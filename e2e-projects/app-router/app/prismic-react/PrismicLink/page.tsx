import { isFilled } from "@prismicio/client";
import { PrismicLink } from "@prismicio/react";
import assert from "assert";

import "@prismicio/next";

import { createClient } from "@/prismicio";

export default async function Page() {
	const client = await createClient();
	const { data: tests } = await client.getSingle("link_test");

	assert(isFilled.link(tests.internal_web));
	assert(isFilled.link(tests.external_web));

	return (
		<>
			<PrismicLink
				field={tests.internal_web}
				data-testid="internal-uses-next-link"
			>
				Link
			</PrismicLink>

			<PrismicLink
				field={tests.external_web}
				data-testid="external-uses-default"
			>
				Link
			</PrismicLink>
		</>
	);
}
