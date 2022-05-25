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
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
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
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
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
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
		},
		linkResolver: () => "linkResolver",
	};

	const resolvePreviewURLSpy = vi
		.spyOn(config.client, "resolvePreviewURL")
		.mockImplementation(async () => "/baz");

	await redirectToPreviewURL(config);

	expect(resolvePreviewURLSpy).toHaveBeenCalledWith({
		linkResolver: config.linkResolver,
		defaultURL: "/",
		documentID: config.req.query.documentId,
		previewToken: config.req.query.token,
	});
});

test("passes the given default URL to client.resolvePreviewURL", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
		},
		defaultURL: "/baz",
	};

	const resolvePreviewURLSpy = vi
		.spyOn(config.client, "resolvePreviewURL")
		.mockImplementation(async () => "/qux");

	await redirectToPreviewURL(config);

	expect(resolvePreviewURLSpy).toHaveBeenCalledWith({
		linkResolver: config.linkResolver,
		defaultURL: config.defaultURL,
		documentID: config.req.query.documentId,
		previewToken: config.req.query.token,
	});
});

test("redirects to `/` by default if the URL params do not contain documentId or token", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {},
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
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
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
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
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
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
		},
		res: {
			redirect: vi.fn().mockImplementation(() => void 0),
		},
		defaultURL: "/foo",
		basePath: "/base/path",
	};

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/base/path/foo");
});
