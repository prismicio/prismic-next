import { createValueMockFactory } from "@prismicio/mock";
import { PrismicNextLink } from "@prismicio/next";

export default function Page() {
	const mock = createValueMockFactory({ seed: "PrismicNextLink" });

	const mediaLink = mock.link({ type: "Media" });
	mediaLink.url = "https://example.com/image.png";

	const documentLinkWithURL = mock.link({ type: "Document" });
	documentLinkWithURL.url = "/foo";
	const documentLinkWithoutURL = mock.link({ type: "Document" });
	documentLinkWithoutURL.url = undefined;
	documentLinkWithoutURL.uid = "foo";

	const documentWithURL = mock.document();
	documentWithURL.url = "/foo";
	const documentWithoutURL = mock.document();
	documentWithoutURL.url = null;
	documentWithoutURL.uid = "foo";

	const internalWebLink = mock.link({ type: "Web" });
	internalWebLink.url = "/foo";
	const externalWebLink = mock.link({ type: "Web" });
	externalWebLink.url = "https://example.com";
	const externalWebLinkWithTarget = mock.link({
		type: "Web",
		withTargetBlank: true,
	});
	externalWebLinkWithTarget.url = "https://example.com";

	const withText = mock.link({ withText: true });
	withText.text = "foo";

	return (
		<>
			<PrismicNextLink
				data-testid="document-link-with-route-resolver"
				field={documentLinkWithURL}
			/>
			<PrismicNextLink
				data-testid="document-link-with-link-resolver"
				field={documentLinkWithoutURL}
				linkResolver={(link) => `/${link.uid}`}
			/>

			<PrismicNextLink data-testid="media-link" field={mediaLink} />

			<PrismicNextLink
				data-testid="document-prop-with-route-resolver"
				document={documentWithURL}
			/>
			<PrismicNextLink
				data-testid="document-prop-with-link-resolver"
				document={documentWithoutURL}
				linkResolver={(link) => `/${link.uid}`}
			/>

			<PrismicNextLink data-testid="internal-web" field={internalWebLink} />
			<PrismicNextLink data-testid="external-web" field={externalWebLink} />
			<PrismicNextLink
				data-testid="external-web-with-target-prop"
				field={externalWebLink}
				target="foo"
			/>
			<PrismicNextLink
				data-testid="external-web-with-rel-prop"
				field={externalWebLink}
				rel="foo"
			/>
			<PrismicNextLink
				data-testid="external-web-with-removed-rel"
				field={externalWebLink}
				rel={undefined}
			/>
			<PrismicNextLink
				data-testid="external-web-with-rel-function"
				field={externalWebLink}
				rel={(payload) => JSON.stringify(payload)}
			/>

			<PrismicNextLink
				data-testid="external-href-prop"
				href="https://example.com"
			/>
			<PrismicNextLink data-testid="internal-href-prop" href="/foo" />
			{/* @ts-expect-error - We are purposely providing an invalid `href` value. */}
			<PrismicNextLink data-testid="falsy-href-prop" href={undefined} />

			<PrismicNextLink data-testid="with-text" field={withText} />
			<PrismicNextLink data-testid="with-text-override" field={withText}>
				override
			</PrismicNextLink>
		</>
	);
}
