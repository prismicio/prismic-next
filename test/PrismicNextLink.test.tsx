// @vitest-environment happy-dom

import { it, expect, vi } from "vitest";
import { ReactTestRendererJSON } from "react-test-renderer";
import { LinkResolverFunction } from "@prismicio/client";
import Link from "next/link";

import { renderJSON } from "./__testutils__/renderJSON";

import { PrismicNextLink } from "../src";

function expectLinkToEqual(
	actual: ReactTestRendererJSON | null,
	expected: ReactTestRendererJSON | null,
) {
	if (actual == null) {
		expect.fail(
			"`actual` must not be null to use `expectLinkToEqual()`, but a null value was provided.",
		);
	}

	if (expected == null) {
		expect.fail(
			"`expected` must not be null to use `expectLinkToEqual()`, but a null value was provided.",
		);
	}

	expect(actual.type, "type").toBe(expected.type);
	expect(actual.props.href, "href").toBe(expected.props.href);
	expect(actual.props.target, "target").toBe(expected.props.target);
	expect(actual.props.rel, "rel").toBe(expected.props.rel);
	expect(actual.children, "children").toEqual(expected.children);
}

it("renders a next/link for web link", (ctx) => {
	const field = ctx.mock.value.link({ type: "Web" });

	const actual = renderJSON(
		<PrismicNextLink field={field}>Foo</PrismicNextLink>,
	);
	const expected = renderJSON(
		<Link href={field.url} rel="noreferrer">
			Foo
		</Link>,
	);

	expectLinkToEqual(actual, expected);
});

it('renders a next/link for web link with "Open in new tab" checked', (ctx) => {
	const field = ctx.mock.value.link({ type: "Web", withTargetBlank: true });

	const actual = renderJSON(
		<PrismicNextLink field={field}>Foo</PrismicNextLink>,
	);
	const expected = renderJSON(
		<Link href={field.url} target="_blank" rel="noreferrer">
			Foo
		</Link>,
	);

	expectLinkToEqual(actual, expected);
});

it("renders a next/link for document link with Route Resolver", (ctx) => {
	const field = ctx.mock.value.link({ type: "Document" });
	field.url = "/foo";

	const actual = renderJSON(
		<PrismicNextLink field={field}>Foo</PrismicNextLink>,
	);
	const expected = renderJSON(<Link href={field.url}>Foo</Link>);

	expectLinkToEqual(actual, expected);
});

it("renders a next/link for document link with Link Resolver", (ctx) => {
	const field = ctx.mock.value.link({ type: "Document" });
	field.url = undefined;

	const linkResolver: LinkResolverFunction = (field) => `/${field.uid}`;

	const actual = renderJSON(
		<PrismicNextLink field={field} linkResolver={linkResolver}>
			Foo
		</PrismicNextLink>,
	);
	const expected = renderJSON(<Link href={`/${field.uid}`}>Foo</Link>);

	expectLinkToEqual(actual, expected);
});

it("renders a next/link for media link", (ctx) => {
	const field = ctx.mock.value.link({ type: "Media" });

	const actual = renderJSON(
		<PrismicNextLink field={field}>Foo</PrismicNextLink>,
	);
	const expected = renderJSON(
		<Link href={field.url} rel="noreferrer">
			Foo
		</Link>,
	);

	expectLinkToEqual(actual, expected);
});

it("renders a next/link for document with Route Resolver", (ctx) => {
	const doc = ctx.mock.value.document();
	doc.url = "https://prismic.io";

	const actual = renderJSON(
		<PrismicNextLink document={doc}>Foo</PrismicNextLink>,
	);
	const expected = renderJSON(
		<Link href={doc.url} rel="noreferrer">
			Foo
		</Link>,
	);

	expectLinkToEqual(actual, expected);
});

it("renders a next/link for document with Link Resolver", (ctx) => {
	const doc = ctx.mock.value.document();
	doc.uid = "foo";

	const linkResolver: LinkResolverFunction = (field) => `/${field.uid}`;

	const actual = renderJSON(
		<PrismicNextLink document={doc} linkResolver={linkResolver}>
			Foo
		</PrismicNextLink>,
	);
	const expected = renderJSON(<Link href={`/${doc.uid}`}>Foo</Link>);

	expectLinkToEqual(actual, expected);
});

it('includes `rel="noreferrer"` when the href is external', (ctx) => {
	const field = ctx.mock.value.link({ type: "Web" });
	field.url = "https://prismic.io";

	const actual = renderJSON(
		<PrismicNextLink field={field}>Foo</PrismicNextLink>,
	);

	expect(actual?.props.rel).toBe("noreferrer");
});

it("passes through target", (ctx) => {
	const field = ctx.mock.value.link({ type: "Web" });

	const actual = renderJSON(
		<PrismicNextLink field={field} target="foo">
			Foo
		</PrismicNextLink>,
	);

	expect(actual?.props.target).toBe("foo");
});

it("passes through rel", (ctx) => {
	const field = ctx.mock.value.link({ type: "Web" });
	field.url = "https://prismic.io";

	const actual = renderJSON(
		<PrismicNextLink field={field} rel="foo">
			Foo
		</PrismicNextLink>,
	);

	expect(actual?.props.rel).toBe("foo");
});

it("allows removing an automatic rel", (ctx) => {
	const field = ctx.mock.value.link({ type: "Web" });
	field.url = "https://prismic.io";

	const actual = renderJSON(
		<PrismicNextLink field={field} rel={undefined}>
			Foo
		</PrismicNextLink>,
	);

	expect(actual?.props.rel).toBe(undefined);
});

it("allows defining rel with a function", (ctx) => {
	const field = ctx.mock.value.link({ type: "Web", withTargetBlank: true });
	field.url = "https://prismic.io";

	const rel = vi.fn(() => "foo");

	const actual = renderJSON(
		<PrismicNextLink field={field} rel={rel}>
			Foo
		</PrismicNextLink>,
	);

	expect(actual?.props.rel).toBe("foo");
	expect(rel).toHaveBeenCalledWith({
		href: field.url,
		target: field.target,
		isExternal: true,
	});
});

it("passes through href", () => {
	const actual = renderJSON(<PrismicNextLink href="/foo">Foo</PrismicNextLink>);

	expect(actual?.props.href).toBe("/foo");
});

it("falsey href falls back to empty string", () => {
	const actual = renderJSON(
		// @ts-expect-error - We are purposely providing an invalid `href` value.
		<PrismicNextLink href={undefined}>Foo</PrismicNextLink>,
	);

	expect(actual?.props.href).toBe("");
});

it("forwards ref", (ctx) => {
	const field = ctx.mock.value.link({ type: "Web" });

	const ref = vi.fn();

	renderJSON(
		<PrismicNextLink ref={ref} field={field}>
			Foo
		</PrismicNextLink>,
		{
			createNodeMock: (element) => ({ tagName: element.type }),
		},
	);

	expect(ref).toHaveBeenCalledWith({ tagName: "a" });
});
