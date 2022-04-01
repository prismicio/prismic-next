// @vitest-environment happy-dom

import { test, expect, fn, beforeAll, vi, afterEach } from "vitest";
import * as React from "react";
import * as renderer from "react-test-renderer";

import { PrismicPreview } from "../src";

/**
 * Renders a JSON representation of a React.Element. This is a helper to reduce
 * boilerplate in each test.
 *
 * @param element - The React.Element to render.
 *
 * @returns The JSON representation of `element`.
 */
export const render = (
	element: React.ReactElement,
	options?: renderer.TestRendererOptions,
): renderer.ReactTestRenderer => {
	let root: renderer.ReactTestRenderer;

	renderer.act(() => {
		root = renderer.create(element, options);
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return root!;
};

/**
 * Waits an event loop tick. This will let us test for mocked async functions in
 * components.
 */
const tick = async () => {
	await new Promise((res) => setTimeout(res, 0));
};

const fetch = fn();
const reload = fn();

beforeAll(() => {
	globalThis.fetch = fetch;
	globalThis.location.reload = reload;
});

afterEach(() => {
	fetch.mockClear();
	reload.mockClear();
});

test("renders the Prismic toolbar for the given repository", () => {
	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	const script = Array.from(document.querySelectorAll("script")).find(
		(element) =>
			element
				.getAttribute("src")
				?.startsWith("https://static.cdn.prismic.io/prismic.js"),
	);

	expect(script?.getAttribute("src")).toMatch(
		"https://static.cdn.prismic.io/prismic.js?repo=qwerty&new=true",
	);

	renderer.act(() => unmount());
});

test("calls the default preview API endpoint on prismicPreviewUpdate toolbar events", async () => {
	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(globalThis.fetch).toHaveBeenCalledWith("/api/preview");
	expect(globalThis.location.reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("calls the given preview API endpoint on prismicPreviewUpdate toolbar events", async () => {
	const { unmount } = render(
		<PrismicPreview repositoryName="qwerty" updatePreviewURL="/foo" />,
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(globalThis.fetch).toHaveBeenCalledWith("/foo");
	expect(globalThis.location.reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("calls the default exit preview API endpoint on prismicPreviewEnd toolbar events", async () => {
	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(globalThis.fetch).toHaveBeenCalledWith("/api/exit-preview");
	expect(globalThis.location.reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("calls the given exit preview API endpoint on prismicPreviewEnd toolbar events", async () => {
	const { unmount } = render(
		<PrismicPreview repositoryName="qwerty" exitPreviewURL="/bar" />,
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(globalThis.fetch).toHaveBeenCalledWith("/bar");
	expect(globalThis.location.reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("unregisters prismicPreviewUpdate event listener on unmount", async () => {
	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	renderer.act(() => {
		unmount();
	});

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(globalThis.fetch).not.toHaveBeenCalledWith("/api/preview");
	expect(globalThis.location.reload).not.toHaveBeenCalled();
});

test("unregisters prismicPreviewEnd event listener on unmount", async () => {
	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	renderer.act(() => {
		unmount();
	});

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(globalThis.fetch).not.toHaveBeenCalledWith("/api/exit-preview");
	expect(globalThis.location.reload).not.toHaveBeenCalled();
});

test("supports shared links", async () => {
	vi.mock("next/router", () => {
		return {
			useRouter: () => {
				return {
					isPreview: false,
				};
			},
		};
	});

	globalThis.document.cookie = `io.prismic.preview=${JSON.stringify({
		"qwerty.prismic.io": {},
	})}`;

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	await tick();

	expect(globalThis.fetch).toHaveBeenCalledWith("/api/preview");
	expect(globalThis.location.reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("renders children untouched", () => {
	const actual = render(
		<PrismicPreview repositoryName="qwerty">
			<span>children</span>
		</PrismicPreview>,
	).toJSON() as renderer.ReactTestRendererJSON;

	const expected = render(
		<span>children</span>,
	).toJSON() as renderer.ReactTestRendererJSON;

	expect(actual).toMatchObject(expected);
});
