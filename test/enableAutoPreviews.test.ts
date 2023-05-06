import { test, expect, vi } from "vitest";
import * as prismic from "@prismicio/client";

import { enableAutoPreviews, EnableAutoPreviewsConfig } from "../src";

const cookiesGet = vi.fn();

vi.mock("next/headers", () => {
	return {
		cookies() {
			return {
				get: cookiesGet,
			};
		},
	};
});

test("enables auto previews in App Router", () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });
	const enableAutoPreviewsFromReqSpy = vi.spyOn(
		client,
		"enableAutoPreviewsFromReq",
	);
	const queryContentFromRefSpy = vi.spyOn(client, "queryContentFromRef");

	enableAutoPreviews({ client });

	expect(enableAutoPreviewsFromReqSpy).not.toHaveBeenCalled();
	expect(queryContentFromRefSpy).toHaveBeenCalledOnce();

	const refThunk = queryContentFromRefSpy.mock.calls[0][0];

	if (typeof refThunk !== "function") {
		expect.fail("The given ref should be a thunk, but it was not.");
	}

	const cookie = JSON.stringify({
		_tracker: "abc123",
		"example-prismic-repo.prismic.io": {
			preview:
				"https://example-prismic-repo.prismic.io/previews/abc:123?websitePreviewId=xyz",
		},
	});

	vi.mocked(cookiesGet).mockImplementation((input) => {
		if (typeof input !== "string") {
			throw new Error("Only string cookie lookups are supported in tests.");
		}

		if (input === prismic.cookie.preview) {
			return {
				name: input,
				value: cookie,
			};
		}
	});

	expect(refThunk()).toBe(cookie);
});

test("auto previews in App Router ignores inactive preview tokens", () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });
	const enableAutoPreviewsFromReqSpy = vi.spyOn(
		client,
		"enableAutoPreviewsFromReq",
	);
	const queryContentFromRefSpy = vi.spyOn(client, "queryContentFromRef");

	enableAutoPreviews({ client });

	expect(enableAutoPreviewsFromReqSpy).not.toHaveBeenCalled();
	expect(queryContentFromRefSpy).toHaveBeenCalledOnce();

	const refThunk = queryContentFromRefSpy.mock.calls[0][0];

	if (typeof refThunk !== "function") {
		expect.fail("The given ref should be a thunk, but it was not.");
	}

	const cookie = JSON.stringify({
		_tracker: "abc123",
	});

	vi.mocked(cookiesGet).mockImplementation((input) => {
		if (typeof input !== "string") {
			throw new Error("Only string cookie lookups are supported in tests.");
		}

		if (input === prismic.cookie.preview) {
			return {
				name: input,
				value: cookie,
			};
		}
	});

	expect(refThunk()).toBe(undefined);
});

test("enables auto previews in the Pages Directory for the given client and server req", () => {
	const config: EnableAutoPreviewsConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {
			query: {},
			cookies: {},
		},
	};
	const spy = vi.spyOn(config.client, "enableAutoPreviewsFromReq");

	enableAutoPreviews(config);

	expect(spy).toHaveBeenCalledWith(config.req);
});

test("enables auto previews in Pages Directory for the given client and previewData", () => {
	const config: EnableAutoPreviewsConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		previewData: { ref: "ref" },
	};
	const spy = vi.spyOn(config.client, "queryContentFromRef");

	enableAutoPreviews(config);

	expect(spy).toHaveBeenCalledWith("ref");
});
