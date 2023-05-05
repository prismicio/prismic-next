import { test, expect, vi } from "vitest";
import * as prismic from "@prismicio/client";

import { redirectToPreviewURL, RedirectToPreviewURLConfig } from "../src";

test("redirects to the previewed document's URL", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
	};

	vi.spyOn(config.client, "resolvePreviewURL").mockImplementation(
		async () => "/baz",
	);

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/baz");
});

test("supports basePath when redirecting to the previewed document's URL", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
		basePath: "/base/path",
	};

	vi.spyOn(config.client, "resolvePreviewURL").mockImplementation(
		async () => "/baz",
	);

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/base/path/baz");
});

test("passes the given link resolver to client.resolvePreviewURL", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
		linkResolver: () => "linkResolver",
	};

	const resolvePreviewURLSpy = vi
		.spyOn(config.client, "resolvePreviewURL")
		.mockImplementation(async () => "/baz");

	await redirectToPreviewURL(config);

	expect(resolvePreviewURLSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			linkResolver: config.linkResolver,
		}),
	);
});

test("passes the given default URL to client.resolvePreviewURL", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
		defaultURL: "/baz",
	};

	const resolvePreviewURLSpy = vi
		.spyOn(config.client, "resolvePreviewURL")
		.mockImplementation(async () => "/qux");

	await redirectToPreviewURL(config);

	expect(resolvePreviewURLSpy).toHaveBeenCalledWith(
		expect.objectContaining({
			defaultURL: config.defaultURL,
		}),
	);
});

test("redirects to `/` by default if the URL params do not contain documentId or token", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
	};

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/");
});

test("supports basePath when redirecting to `/` by default if the URL params do not contain documentId or token", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
		basePath: "/base/path",
	};

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/base/path/");
});

test("redirects to the given default URL if the URL params do not contain documentId or token", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
		defaultURL: "/foo",
	};

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/foo");
});

test("supports basePath when redirecting to the given default URL if the URL params do not contain documentId or token", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {},
			cookies: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => "res" in config && config.res),
			clearPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
			status: vi.fn().mockImplementation(() => "res" in config && config.res),
			json: vi.fn(),
			setPreviewData: vi
				.fn()
				.mockImplementation(() => "res" in config && config.res),
		},
		defaultURL: "/foo",
		basePath: "/base/path",
	};

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/base/path/foo");
});
