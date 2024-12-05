import { it, expect, vi, describe } from "vitest";
import { draftMode, cookies } from "next/headers";
import * as prismic from "@prismicio/client";

import { enableAutoPreviews, EnableAutoPreviewsConfig } from "../src";

const cookiesGet = vi.fn();

vi.mock("next/headers", () => {
	return {
		draftMode: vi.fn(),
		cookies: vi.fn(() => {
			return {
				get: cookiesGet,
			};
		}),
	};
});

describe("App Router", () => {
	const activeCookie = JSON.stringify({
		_tracker: "abc123",
		"example-prismic-repo.prismic.io": {
			preview:
				"https://example-prismic-repo.prismic.io/previews/abc:123?websitePreviewId=xyz",
		},
	});

	const inactiveCookie = JSON.stringify({
		_tracker: "abc123",
	});

	it("enables auto previews", async () => {
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

		vi.mocked(draftMode).mockReturnValue(
			Promise.resolve({
				isEnabled: true,
				disable: () => void 0,
				enable: () => void 0,
			}),
		);

		vi.mocked(cookiesGet).mockImplementation((input) => {
			if (input === prismic.cookie.preview) {
				return {
					name: input,
					value: activeCookie,
				};
			}
		});

		expect(await refThunk()).toBe(activeCookie);
	});

	it("ignores inactive preview cookies", async () => {
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

		vi.mocked(cookiesGet).mockImplementation((input) => {
			if (typeof input !== "string") {
				throw new Error("Only string cookie lookups are supported in tests.");
			}

			if (input === prismic.cookie.preview) {
				return {
					name: input,
					value: inactiveCookie,
				};
			}
		});

		expect(await refThunk()).toBe(undefined);
	});

	it("does not enable previews if draft mode is disabled", async () => {
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

		vi.mocked(draftMode).mockReturnValue(
			Promise.resolve({
				isEnabled: false,
				disable: () => void 0,
				enable: () => void 0,
			}),
		);

		expect(cookiesGet).not.toHaveBeenCalled();

		expect(await refThunk()).toBe(undefined);
	});

	it("does not enable previews if draftMode() throws", async () => {
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

		vi.mocked(draftMode).mockImplementation(() => {
			throw new Error("not implemented");
		});

		expect(cookiesGet).not.toHaveBeenCalled();

		expect(await refThunk()).toBe(undefined);
	});

	it("does not enable previews if cookies() throws", async () => {
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

		vi.mocked(draftMode).mockReturnValue(
			Promise.resolve({
				isEnabled: true,
				disable: () => void 0,
				enable: () => void 0,
			}),
		);

		vi.mocked(cookies).mockImplementation(() => {
			throw new Error("not implemented");
		});

		expect(await refThunk()).toBe(undefined);
	});
});

describe("Pages Router", () => {
	it("enables auto previews for the given client and server req", () => {
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

	it("enables auto previews for the given client and previewData", () => {
		const config: EnableAutoPreviewsConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			previewData: { ref: "ref" },
		};
		const spy = vi.spyOn(config.client, "queryContentFromRef");

		enableAutoPreviews(config);

		expect(spy).toHaveBeenCalledWith("ref");
	});

	it("does not enable auto previews if the given previewData is invalid", () => {
		const config: EnableAutoPreviewsConfig = {
			client: prismic.createClient("qwerty", { fetch: vi.fn() }),
			previewData: {},
		};
		const spy = vi.spyOn(config.client, "queryContentFromRef");

		enableAutoPreviews(config);

		expect(spy).not.toHaveBeenCalled();
	});
});
