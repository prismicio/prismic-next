// @vitest-environment happy-dom

import { test, expect, beforeAll, vi, afterEach } from "vitest";
import { NextRouter, useRouter } from "next/router";
import Script from "next/script";
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

vi.mock("next/router", () => {
	return {
		useRouter: vi.fn(() => {
			return {
				isPreview: true,
				basePath: "",
			};
		}),
	};
});

vi.mock("next/script", () => {
	return {
		default: vi.fn(({ src, strategy }: { src: string; strategy: string }) => {
			return (
				<div data-next-script={true} data-src={src} data-strategy={strategy} />
			);
		}),
	};
});

const fetch = vi.fn(async () => {
	return {
		status: 200,
		ok: true,
		redirected: true,
	} as Response;
});
const reload = vi.fn();

beforeAll(() => {
	globalThis.fetch = fetch;
	globalThis.location.reload = reload;
	globalThis.console.error = vi.fn();
});

afterEach(() => {
	fetch.mockRestore();
	reload.mockRestore();
	vi.mocked(globalThis.console.error).mockRestore();

	vi.mocked(useRouter).mockRestore();
});

test("renders the Prismic toolbar for the given repository using next/script", () => {
	const { unmount, toJSON } = render(
		<PrismicPreview repositoryName="qwerty" />,
	);

	const actual = toJSON();

	renderer.act(() => unmount());

	const expected = render(
		<Script
			src="https://static.cdn.prismic.io/prismic.js?repo=qwerty&new=true"
			strategy="lazyOnload"
		/>,
	).toJSON();

	expect(actual).toStrictEqual(expected);
});

test("calls the default preview API endpoint on prismicPreviewUpdate toolbar events", async () => {
	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(reload).toHaveBeenCalled();

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

	expect(fetch).toHaveBeenCalledWith("/foo");
	expect(reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewUpdate toolbar events with default preview API endpoint", async () => {
	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
		} as NextRouter;
	});

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/api/preview");

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewUpdate toolbar events with given preview API endpoint", async () => {
	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
		} as NextRouter;
	});

	const { unmount } = render(
		<PrismicPreview repositoryName="qwerty" updatePreviewURL="/bar" />,
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/bar");

	renderer.act(() => unmount());
});

test("calls the default exit preview API endpoint on prismicPreviewEnd toolbar events", async () => {
	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/exit-preview");
	expect(reload).toHaveBeenCalled();

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

	expect(fetch).toHaveBeenCalledWith("/bar");
	expect(reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewEnd toolbar events with default preview API endpoint", async () => {
	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
		} as NextRouter;
	});

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/api/exit-preview");

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewEnd toolbar events with given preview API endpoint", async () => {
	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
		} as NextRouter;
	});

	const { unmount } = render(
		<PrismicPreview repositoryName="qwerty" exitPreviewURL="/bar" />,
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/bar");

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

	expect(fetch).not.toHaveBeenCalledWith("/api/preview");
	expect(reload).not.toHaveBeenCalled();
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

	expect(fetch).not.toHaveBeenCalledWith("/api/exit-preview");
	expect(reload).not.toHaveBeenCalled();
});

test("supports shared links", async () => {
	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: false,
			basePath: "",
		} as NextRouter;
	});

	globalThis.document.cookie = `io.prismic.preview=${JSON.stringify({
		"qwerty.prismic.io": {},
	})}`;

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("ignores invalid preview cookie", async () => {
	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: false,
			basePath: "",
		} as NextRouter;
	});

	globalThis.document.cookie = `io.prismic.preview=${JSON.stringify({
		"invalid.example.com": {},
	})}`;

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	await tick();

	expect(fetch).not.toHaveBeenCalled();
	expect(reload).not.toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("does nothing if not an active preview session", async () => {
	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: false,
			basePath: "",
		} as NextRouter;
	});

	globalThis.document.cookie = `io.prismic.preview=`;

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	await tick();

	expect(fetch).not.toHaveBeenCalled();
	expect(reload).not.toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("renders children untouched", () => {
	const actual = render(
		<PrismicPreview repositoryName="qwerty">
			<span>children</span>
		</PrismicPreview>,
	).toJSON() as renderer.ReactTestRendererJSON;

	const expected = render(
		<>
			<span>children</span>
			<Script
				src="https://static.cdn.prismic.io/prismic.js?repo=qwerty&new=true"
				strategy="lazyOnload"
			/>
		</>,
	).toJSON() as renderer.ReactTestRendererJSON;

	expect(actual).toMatchObject(expected);
});

test("handles a case where updatePreviewURL redirects correctly, but to a non-existent page", async () => {
	vi.mocked(fetch).mockReturnValue(
		Promise.resolve({
			status: 404,
			ok: false,
			redirected: true,
		} as Response),
	);

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(reload).toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("logs error if updatePreviewURL is not accessible", async () => {
	vi.mocked(fetch).mockReturnValue(
		Promise.resolve({
			status: 500,
			ok: false,
			redirected: false,
		} as Response),
	);

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(globalThis.console.error).toHaveBeenCalledWith(
		expect.stringMatching(/failed to start or update preview mode/i),
	);
	expect(reload).not.toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("logs error if exitPreviewURL is not accessible", async () => {
	vi.mocked(fetch).mockReturnValue(
		Promise.resolve({
			status: 500,
			ok: false,
			redirected: false,
		} as Response),
	);

	const { unmount } = render(<PrismicPreview repositoryName="qwerty" />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/exit-preview");
	expect(globalThis.console.error).toHaveBeenCalledWith(
		expect.stringMatching(/failed to exit preview mode/i),
	);
	expect(reload).not.toHaveBeenCalled();

	renderer.act(() => unmount());
});
