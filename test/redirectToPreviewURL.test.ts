import { expect, vi } from "vitest";
import { redirect } from "next/navigation";
import { cookie as prismicCookie } from "@prismicio/client";

import { redirectToPreviewURL } from "../src";
import { it } from "./it";

const cookies = {
	get: vi.fn(),
	set: vi.fn(),
};

const draftModeEnableFn = vi.fn();

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

vi.mock("next/headers", () => ({
	draftMode: async () => ({
		isEnabled: false,
		disable: () => {},
		enable: draftModeEnableFn,
	}),
	cookies: async () => cookies,
}));

const nextUrl = new URL("https://example.com/api/preview");
nextUrl.searchParams.set("token", "foo");

const request = {
	url: nextUrl.pathname,
	nextUrl,
	headers: { get: () => null },
};

it("redirects to the previewed document's URL", async ({ client }) => {
	vi.spyOn(client, "resolvePreviewURL").mockImplementation(async () => "/bar");
	await redirectToPreviewURL({ client, request });
	expect(redirect).toHaveBeenCalledWith("/bar");
});

it("enables draft mode", async ({ client }) => {
	await redirectToPreviewURL({ client, request });
	expect(draftModeEnableFn).toHaveBeenCalled();
});

it("sets the initial preview cookie provided by the preview URL", async ({
	client,
}) => {
	await redirectToPreviewURL({ client, request });
	expect(cookies.set).toHaveBeenCalledWith(prismicCookie.preview, "foo");
});
