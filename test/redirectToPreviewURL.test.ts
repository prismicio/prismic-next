import { test, expect, fn, spyOn } from "vitest";
import * as prismic from "@prismicio/client";

import { redirectToPreviewURL, RedirectToPreviewURLConfig } from "../src";

test("redirects to the previewed document's URL", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
		},
		res: {
			redirect: fn().mockImplementation(() => void 0),
		},
	};

	spyOn(config.client, "resolvePreviewURL").mockImplementation(
		async () => "/baz",
	);

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/baz");
});

test("passes the given link resolver to client.resolvePreviewURL", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
		},
		res: {
			redirect: fn().mockImplementation(() => void 0),
		},
		linkResolver: () => "linkResolver",
	};

	const resolvePreviewURLSpy = spyOn(
		config.client,
		"resolvePreviewURL",
	).mockImplementation(async () => "/baz");

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
		client: prismic.createClient("qwerty", { fetch: fn() }),
		req: {
			query: {
				documentId: "foo",
				token: "bar",
			},
		},
		res: {
			redirect: fn().mockImplementation(() => void 0),
		},
		defaultURL: "/baz",
	};

	const resolvePreviewURLSpy = spyOn(
		config.client,
		"resolvePreviewURL",
	).mockImplementation(async () => "/qux");

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
		client: prismic.createClient("qwerty", { fetch: fn() }),
		req: {
			query: {},
		},
		res: {
			redirect: fn().mockImplementation(() => void 0),
		},
	};

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/");
});

test("redirects to the given default URL if the URL params do not contain documentId or token", async () => {
	const config: RedirectToPreviewURLConfig = {
		client: prismic.createClient("qwerty", { fetch: fn() }),
		req: {
			query: {},
		},
		res: {
			redirect: fn().mockImplementation(() => void 0),
		},
		defaultURL: "/foo",
	};

	await redirectToPreviewURL(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/foo");
});
