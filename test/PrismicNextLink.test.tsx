import { describe, expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { createValueMockFactory } from "@prismicio/mock";

import { it } from "./it";

import { PrismicNextLink } from "../src";

const mock = createValueMockFactory({ seed: "PrismicNextLink" });

describe("web links", () => {
	const internalWebLink = mock.link({ type: "Web" });
	internalWebLink.url = "/foo";

	const externalWebLink = mock.link({ type: "Web" });
	externalWebLink.url = "https://example.com";

	const webLinkWithTarget = mock.link({ type: "Web", withTargetBlank: true });

	it("renders an internal web link", async () => {
		const screen = render(
			<PrismicNextLink field={internalWebLink} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", internalWebLink.url);
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});

	it("renders an external web link", async () => {
		const screen = render(
			<PrismicNextLink field={externalWebLink} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", externalWebLink.url);
		await expect.element(link).toHaveAttribute("rel", "noreferrer");
		await expect.element(link).not.toHaveAttribute("target");
	});

	it("renders a web link with _blank target", async () => {
		const screen = render(
			<PrismicNextLink field={webLinkWithTarget} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("target", "_blank");
	});

	it("renders an external web link with a provided target", async () => {
		const screen = render(
			<PrismicNextLink
				field={webLinkWithTarget}
				target="foo"
				data-testid="link"
			/>,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("target", "foo");
	});

	it("renders an external web link with a provided rel", async () => {
		const screen = render(
			<PrismicNextLink
				field={webLinkWithTarget}
				rel="foo"
				data-testid="link"
			/>,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("rel", "foo");
	});

	it("can render an external web link without a rel", async () => {
		const screen = render(
			<PrismicNextLink
				field={webLinkWithTarget}
				rel={undefined}
				data-testid="link"
			/>,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).not.toHaveAttribute("rel");
	});

	it("can render an external web link with rel derived from a function", async () => {
		const relFn = vi.fn(() => "foo");
		const screen = render(
			<PrismicNextLink
				field={webLinkWithTarget}
				rel={relFn}
				data-testid="link"
			/>,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("rel", "foo");
		expect(relFn).toHaveBeenCalledWith({
			href: webLinkWithTarget.url,
			isExternal: true,
			target: webLinkWithTarget.target,
		});
	});
});

describe("document links", () => {
	const documentLinkWithURL = mock.link({ type: "Document" });
	documentLinkWithURL.url = "/foo";

	const documentLinkWithoutURL = mock.link({ type: "Document" });
	documentLinkWithoutURL.url = undefined;
	documentLinkWithoutURL.uid = "foo";

	it("renders a document link with a route resolver", async () => {
		const screen = render(
			<PrismicNextLink field={documentLinkWithURL} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", "/foo");
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});

	it("renders a document link with a link resolver", async () => {
		const screen = render(
			<PrismicNextLink
				field={documentLinkWithoutURL}
				linkResolver={(link) => `/${link.uid}`}
				data-testid="link"
			/>,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", "/foo");
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});
});

describe("media links", () => {
	const mediaLink = mock.link({ type: "Media" });
	mediaLink.url = "https://example.com/image.png";

	it("renders a media link", async () => {
		const screen = render(
			<PrismicNextLink field={mediaLink} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect
			.element(link)
			.toHaveAttribute("href", "https://example.com/image.png");
		await expect.element(link).toHaveAttribute("rel", "noreferrer");
		await expect.element(link).not.toHaveAttribute("target");
	});
});

describe("documents", () => {
	const documentWithURL = mock.document();
	documentWithURL.url = "/foo";

	const documentWithoutURL = mock.document();
	documentWithoutURL.url = null;
	documentWithoutURL.uid = "foo";

	it("renders a document link with a route resolver via the document prop", async () => {
		const screen = render(
			<PrismicNextLink document={documentWithURL} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", "/foo");
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});

	it("renders a document link with a link resolver via the document prop", async () => {
		const screen = render(
			<PrismicNextLink
				document={documentWithoutURL}
				linkResolver={(link) => `/${link.uid}`}
				data-testid="link"
			/>,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", "/foo");
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});
});

describe("href", () => {
	it("renders an external href", async () => {
		const screen = render(
			<PrismicNextLink href="https://example.com" data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", "https://example.com");
		// TODO: We should be setting `rel="noreferrer"` with an external `href`.
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});

	it("renders an internal href", async () => {
		const screen = render(<PrismicNextLink href="/foo" data-testid="link" />);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", "/foo");
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});

	it("renders an empty string on falsy href", async () => {
		const screen = render(
			// @ts-expect-error - We are purposely providing an invalid `href` value.
			<PrismicNextLink href={undefined} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toHaveAttribute("href", "");
		await expect.element(link).not.toHaveAttribute("rel");
		await expect.element(link).not.toHaveAttribute("target");
	});
});

describe("with text", () => {
	const withText = mock.link({ withText: true });
	withText.text = "foo";

	it("renders a link's text as children", async () => {
		const screen = render(
			<PrismicNextLink field={withText} data-testid="link" />,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toContainHTML("foo");
	});

	it("renders the given children, overriding the link's text", async () => {
		const screen = render(
			<PrismicNextLink field={withText} data-testid="link">
				override
			</PrismicNextLink>,
		);
		const link = screen.getByTestId("link");
		await expect.element(link).toContainHTML("override");
	});
});

describe("ref", () => {
	it("forwards ref", async () => {
		let ref = null as HTMLAnchorElement | null;
		render(
			<PrismicNextLink
				ref={(el) => {
					ref = el;
				}}
				href=""
				data-testid="link"
			/>,
		);
		expect(ref?.tagName).toBe("A");
	});
});
