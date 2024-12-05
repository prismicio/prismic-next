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

const mockPagePath = "/foo";

vi.mock("next/router", () => {
	const replace = vi.fn();

	return {
		useRouter: vi.fn(() => {
			return {
				isPreview: true,
				basePath: "",
				asPath: mockPagePath,
				replace,
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

vi.mock("next/headers", () => {
	return {
		draftMode: vi.fn(() => {
			return {
				isEnabled: false,
			};
		}),
	};
});

const fetch = vi.fn(async () => {
	return {
		ok: true,
		redirected: true,
	} as Response;
});
const reload = vi.fn();

beforeAll(() => {
	globalThis.fetch = fetch;
	globalThis.location.reload = reload;
	globalThis.console.error = vi.fn();

	window.location.href = "https://example.com";
});

afterEach(() => {
	fetch.mockRestore();
	reload.mockRestore();
	vi.mocked(globalThis.console.error).mockRestore();

	vi.mocked(useRouter).mockRestore();

	const router = useRouter();
	vi.mocked(router.replace).mockRestore();
});

test("renders the Prismic toolbar for the given repository using next/script", async () => {
	const { unmount, toJSON } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	const actual = toJSON();

	renderer.act(() => unmount());

	const expected = render(
		<Script
			src="https://static.cdn.prismic.io/prismic.js?new=true&repo=qwerty"
			strategy="lazyOnload"
		/>,
	).toJSON();

	expect(actual).toStrictEqual(expected);
});

test("calls the default preview API endpoint on prismicPreviewUpdate toolbar events", async () => {
	const router = useRouter();
	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(router.replace).toHaveBeenCalledWith(mockPagePath, undefined, {
		scroll: false,
	});

	renderer.act(() => unmount());
});

test("calls the given preview API endpoint on prismicPreviewUpdate toolbar events", async () => {
	const router = useRouter();
	const { unmount } = render(
		await PrismicPreview({
			repositoryName: "qwerty",
			updatePreviewURL: "/foo",
		}),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo");
	expect(router.replace).toHaveBeenCalledWith(mockPagePath, undefined, {
		scroll: false,
	});

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewUpdate toolbar events with default preview API endpoint", async () => {
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/api/preview");

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewUpdate toolbar events with given preview API endpoint", async () => {
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	const { unmount } = render(
		await PrismicPreview({
			repositoryName: "qwerty",
			updatePreviewURL: "/bar",
		}),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/bar");

	renderer.act(() => unmount());
});

test("calls the default exit preview API endpoint on prismicPreviewEnd toolbar events", async () => {
	const router = useRouter();
	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/exit-preview");
	expect(router.replace).toHaveBeenCalledWith(mockPagePath, undefined, {
		scroll: false,
	});

	renderer.act(() => unmount());
});

test("calls the given exit preview API endpoint on prismicPreviewEnd toolbar events", async () => {
	const router = useRouter();
	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty", exitPreviewURL: "/bar" }),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/bar");
	expect(router.replace).toHaveBeenCalledWith(mockPagePath, undefined, {
		scroll: false,
	});

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewEnd toolbar events with default preview API endpoint", async () => {
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/api/exit-preview");

	renderer.act(() => unmount());
});

test("supports basePath on prismicPreviewEnd toolbar events with given preview API endpoint", async () => {
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: true,
			basePath: "/foo",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty", exitPreviewURL: "/bar" }),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/foo/bar");

	renderer.act(() => unmount());
});

test("unregisters prismicPreviewUpdate event listener on unmount", async () => {
	const router = useRouter();
	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	renderer.act(() => {
		unmount();
	});

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).not.toHaveBeenCalledWith("/api/preview");
	expect(router.replace).not.toHaveBeenCalled();
});

test("unregisters prismicPreviewEnd event listener on unmount", async () => {
	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

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
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: false,
			basePath: "",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	globalThis.document.cookie = `io.prismic.preview=${JSON.stringify({
		_tracker: "_tracker",
		"qwerty.prismic.io": {},
	})}`;

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(replace).toHaveBeenCalledWith(mockPagePath, undefined, {
		scroll: false,
	});

	renderer.act(() => unmount());
});

test("supports shared links when `_tracker` is not in the preview cookie", async () => {
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: false,
			basePath: "",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	globalThis.document.cookie = `io.prismic.preview=${JSON.stringify({
		"qwerty.prismic.io": {},
	})}`;

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(replace).toHaveBeenCalledWith(mockPagePath, undefined, {
		scroll: false,
	});

	renderer.act(() => unmount());
});

test("ignores invalid preview cookie", async () => {
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: false,
			basePath: "",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	globalThis.document.cookie = `io.prismic.preview=${JSON.stringify({
		"invalid.example.com": {},
	})}`;

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	await tick();

	expect(fetch).not.toHaveBeenCalled();
	expect(replace).not.toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("does nothing if not an active preview session", async () => {
	const replace = vi.fn() as NextRouter["replace"];

	vi.mocked(useRouter).mockImplementation(() => {
		return {
			isPreview: false,
			basePath: "",
			asPath: mockPagePath,
			replace,
		} as NextRouter;
	});

	globalThis.document.cookie = `io.prismic.preview=`;

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	await tick();

	expect(fetch).not.toHaveBeenCalled();
	expect(replace).not.toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("renders children untouched", async () => {
	const actual = render(
		await PrismicPreview({
			repositoryName: "qwerty",
			children: <span>children</span>,
		}),
	).toJSON() as renderer.ReactTestRendererJSON;

	const expected = render(
		<>
			<span>children</span>
			<Script
				src="https://static.cdn.prismic.io/prismic.js?new=true&repo=qwerty"
				strategy="lazyOnload"
			/>
		</>,
	).toJSON() as renderer.ReactTestRendererJSON;

	expect(actual).toMatchObject(expected);
});

test("logs error if updatePreviewURL is not accessible", async () => {
	const router = useRouter();
	vi.mocked(fetch).mockReturnValue(Promise.resolve({ ok: false } as Response));

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	await tick();

	expect(fetch).toHaveBeenCalledWith("/api/preview");
	expect(globalThis.console.error).toHaveBeenCalledWith(
		expect.stringMatching(/failed to start or update preview mode/i),
	);
	expect(router.replace).not.toHaveBeenCalled();

	renderer.act(() => unmount());
});

test("logs error if exitPreviewURL is not accessible", async () => {
	vi.mocked(fetch).mockReturnValue(Promise.resolve({ ok: false } as Response));

	const { unmount } = render(
		await PrismicPreview({ repositoryName: "qwerty" }),
	);

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
