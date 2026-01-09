import type { JSX } from "react";
import Link from "next/link";
import { isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import assert from "assert";

import { createClient } from "@/prismicio";

export default async function Page(): Promise<JSX.Element> {
	const client = await createClient();
	const { data: tests } = await client.getSingle("link_test");
	assert(isFilled.contentRelationship(tests.document) && tests.document.url);
	const doc = await client.getByID(tests.document.id);

	assert(isFilled.linkToMedia(tests.media));
	assert(
		isFilled.link(tests.internal_web) &&
			tests.internal_web.link_type === "Web" &&
			!tests.internal_web.url.startsWith("http"),
	);
	assert(
		isFilled.link(tests.external_web) &&
			tests.external_web.link_type === "Web" &&
			tests.external_web.url.startsWith("http"),
	);
	assert(
		isFilled.link(tests.external_web_with_target) &&
			tests.external_web_with_target.link_type === "Web" &&
			tests.external_web_with_target.url.startsWith("http") &&
			tests.external_web_with_target.target,
	);
	assert(isFilled.link(tests.with_text) && tests.with_text.text);

	return (
		<>
			<PrismicNextLink
				data-testid="document-link-with-route-resolver"
				field={tests.document}
			/>
			<PrismicNextLink
				data-testid="document-link-with-link-resolver"
				field={tests.document}
				linkResolver={(link) => `/${link.uid}`}
			/>

			<PrismicNextLink data-testid="media-link" field={tests.media} />

			<PrismicNextLink
				data-testid="document-prop-with-route-resolver"
				document={doc}
			/>
			<PrismicNextLink
				data-testid="document-prop-with-link-resolver"
				document={doc}
				linkResolver={(link) => `/${link.uid}`}
			/>

			<PrismicNextLink data-testid="internal-web" field={tests.internal_web} />
			<PrismicNextLink data-testid="external-web" field={tests.external_web} />
			<PrismicNextLink
				data-testid="external-web-with-target"
				field={tests.external_web_with_target}
			/>
			<PrismicNextLink
				data-testid="external-web-with-target-override"
				field={tests.external_web_with_target}
				target="foo"
			/>
			<PrismicNextLink
				data-testid="external-web-with-rel-prop"
				field={tests.external_web}
				rel="foo"
			/>
			<PrismicNextLink
				data-testid="external-web-with-removed-rel"
				field={tests.external_web}
				rel={undefined}
			/>
			<PrismicNextLink
				data-testid="external-web-with-rel-function"
				field={tests.external_web}
				rel={(payload) => JSON.stringify(payload)}
			/>

			<PrismicNextLink
				data-testid="external-href-prop"
				href="https://example.com"
			/>
			<PrismicNextLink data-testid="internal-href-prop" href="/example" />
			{/* @ts-expect-error - We are purposely providing an invalid `href` value. */}
			<PrismicNextLink data-testid="falsy-href-prop" href={undefined} />
			<Link data-testid="default-link-falsy-href" href="" />

			<PrismicNextLink data-testid="with-text" field={tests.with_text} />
			<PrismicNextLink data-testid="with-text-override" field={tests.with_text}>
				override
			</PrismicNextLink>
		</>
	);
}
