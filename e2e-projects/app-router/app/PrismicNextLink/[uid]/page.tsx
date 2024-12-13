import Link from "next/link";
import { notFound } from "next/navigation";
import { NotFoundError, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import assert from "assert";

import { createClient } from "@/prismicio";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
	const { uid } = await params;

	const client = await createClient({
		routes: [{ type: "page", path: "/:uid" }],
	});
	const { data: tests } = await client
		.getByUID("link_test", uid)
		.catch((error) => {
			if (error instanceof NotFoundError) notFound();
			throw error;
		});
	assert(isFilled.contentRelationship(tests.document) && tests.document.url);
	const doc = await client.getByID(tests.document.id);
	console.log({ doc: JSON.stringify(doc) });

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
