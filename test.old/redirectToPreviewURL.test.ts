import { it, expect, vi, describe, beforeEach } from "vitest";
import { redirect } from "next/navigation";
import * as prismic from "@prismicio/client";

import { redirectToPreviewURL, RedirectToPreviewURLConfig } from "../src";

let cookiesStore = new Map<string, string>();
const cookies = {
	get: vi.fn((name: string) => {
		return cookiesStore.get(name);
	}),
	set: vi.fn((name: string, value: string) => {
		return cookiesStore.set(name, value);
	}),
};

const draftMode = {
	enable: vi.fn(),
};

vi.mock("next/headers", () => {
	return {
		cookies() {
			return cookies;
		},
		draftMode() {
			return draftMode;
		},
	};
});

vi.mock("next/navigation", () => {
	return {
		redirect: vi.fn(),
	};
});

beforeEach(() => {
	cookiesStore = new Map();
});

describe("App Router", () => {
	it("redirects to the previewed document's URL", async () => {
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			request: {
				url: "/foo",
				nextUrl: {
					pathname: "/foo",
					searchParams: {
						get() {
							return null;
						},
					},
				},
				headers: {
					get: vi.fn(),
				},
			},
		};

		vi.spyOn(config.client, "resolvePreviewURL").mockImplementation(
			async () => "/bar",
		);

		await redirectToPreviewURL(config);

		expect(redirect).toHaveBeenCalledWith("/bar");
	});

	it("supports basePath when redirecting to the previewed document's URL", async () => {
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			request: {
				url: "/foo",
				nextUrl: {
					pathname: "/foo",
					searchParams: {
						get() {
							return null;
						},
					},
				},
				headers: {
					get: vi.fn(),
				},
			},
			basePath: "/base/path",
		};

		vi.spyOn(config.client, "resolvePreviewURL").mockImplementation(
			async () => "/bar",
		);

		await redirectToPreviewURL(config);

		expect(redirect).toHaveBeenCalledWith("/base/path/bar");
	});

	it("enables draft mode", async () => {
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			request: {
				url: `/foo`,
				nextUrl: {
					pathname: "/foo",
					searchParams: {
						get() {
							return null;
						},
					},
				},
				headers: {
					get: vi.fn(),
				},
			},
		};

		vi.spyOn(config.client, "resolvePreviewURL").mockImplementation(
			async () => "/bar",
		);

		await redirectToPreviewURL(config);

		expect(draftMode.enable).toHaveBeenCalled();
	});

	it("sets the initial preview cookie provided by the preview URL", async () => {
		const token = "previewToken";

		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			request: {
				url: `/foo?token=${token}`,
				nextUrl: {
					pathname: "/foo",
					searchParams: {
						get(name) {
							if (name === "token") {
								return token;
							}

							return null;
						},
					},
				},
				headers: {
					get: vi.fn(),
				},
			},
		};

		vi.spyOn(config.client, "resolvePreviewURL").mockImplementation(
			async () => "/bar",
		);

		await redirectToPreviewURL(config);

		expect(cookies.set).toHaveBeenCalledWith("io.prismic.preview", token);
	});
});

describe("Pages Router", () => {
	it("redirects to the previewed document's URL", async () => {
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
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
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

	it("supports basePath when redirecting to the previewed document's URL", async () => {
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
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
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

	it("passes the given link resolver to client.resolvePreviewURL", async () => {
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
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
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

	it("passes the given default URL to client.resolvePreviewURL", async () => {
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
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
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

	it("redirects to `/` by default if the URL params do not contain documentId or token", async () => {
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			req: {
				query: {},
				cookies: {},
			},
			res: {
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				json: vi.fn(),
				setPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
			},
		};

		await redirectToPreviewURL(config);

		expect(config.res.redirect).toHaveBeenCalledWith("/");
	});

	it("supports basePath when redirecting to `/` by default if the URL params do not contain documentId or token", async () => {
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			req: {
				query: {},
				cookies: {},
			},
			res: {
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
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

	it("redirects to the given default URL if the URL params do not contain documentId or token", async () => {
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			req: {
				query: {},
				cookies: {},
			},
			res: {
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
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

	it("supports basePath when redirecting to the given default URL if the URL params do not contain documentId or token", async () => {
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			req: {
				query: {},
				cookies: {},
			},
			res: {
				redirect: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				clearPreviewData: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
				setHeader: vi
					.fn()
					.mockImplementation(() => "res" in config && config.res),
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

	it("throws if res is not provided", async () => {
		// @ts-expect-error - We are purposely omitting `res` from the config.
		const config: RedirectToPreviewURLConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			req: {
				query: {
					documentId: "foo",
					token: "bar",
				},
				cookies: {},
			},
		};

		vi.spyOn(config.client, "resolvePreviewURL").mockImplementation(
			async () => "/baz",
		);

		expect(async () => {
			await redirectToPreviewURL(
				// @ts-expect-error - We are purposely omitting `res` from the config.
				config,
			);
		}).rejects.toThrow(/the `res` object from the api route must be provided/i);
	});
});
