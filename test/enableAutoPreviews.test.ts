import { test, expect, vi } from "vitest";
import * as prismic from "@prismicio/client";

import { enableAutoPreviews, EnableAutoPreviewsConfig } from "../src";

test("enables auto previews for the given client and server req", () => {
	const config: EnableAutoPreviewsConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		req: {},
	};
	const spy = vi.spyOn(config.client, "enableAutoPreviewsFromReq");

	enableAutoPreviews(config);

	expect(spy).toHaveBeenCalledWith(config.req);
});

test("enables auto previews for the given client and previewData", () => {
	const config: EnableAutoPreviewsConfig = {
		client: prismic.createClient("qwerty", { fetch: vi.fn() }),
		previewData: { ref: "ref" },
	};
	const spy = vi.spyOn(config.client, "queryContentFromRef");

	enableAutoPreviews(config);

	expect(spy).toHaveBeenCalledWith("ref");
});

test("does not enable auto previews for the given client if a server req or previewData is not given", () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });
	const enableAutoPreviewsFromReqSpy = vi.spyOn(
		client,
		"enableAutoPreviewsFromReq",
	);
	const queryContentFromRefSpy = vi.spyOn(client, "queryContentFromRef");

	enableAutoPreviews({ client });

	expect(enableAutoPreviewsFromReqSpy).not.toHaveBeenCalled();
	expect(queryContentFromRefSpy).not.toHaveBeenCalled();
});
