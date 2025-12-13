import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import assert from "assert";

import "@prismicio/next";

import { createClient } from "@/prismicio";

export default async function Page() {
	const client = await createClient();
	const { data: tests } = await client.getSingle("rich_text_test");

	assert(isFilled.richText(tests.hyperlink_internal));
	assert(isFilled.richText(tests.hyperlink_external));

	return (
		<>
			<div data-testid="internal-uses-next-link">
				<PrismicRichText field={tests.hyperlink_internal} />
			</div>

			<div data-testid="external-uses-default">
				<PrismicRichText field={tests.hyperlink_external} />
			</div>
		</>
	);
}
