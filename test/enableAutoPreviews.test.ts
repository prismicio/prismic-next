import { expect, vi, beforeEach } from "vitest";
import { draftMode } from "next/headers";
import { cookie as prismicCookie } from "@prismicio/client";

import { Fixtures, it } from "./it";

import { enableAutoPreviews } from "../src";

const cookiesGet = vi.fn();

vi.mock("next/headers", () => ({
	draftMode: vi.fn().mockReturnValue({
		isEnabled: false,
		disable: () => {},
		enabled: () => {},
	}),
	cookies: vi.fn(async () => ({
		get: cookiesGet,
	})),
}));

function mockPreviewCookie(value: string) {
	vi.mocked(cookiesGet).mockImplementation((name) => {
		if (name === prismicCookie.preview) return { name, value };
	});
}

function mockDraftMode(isEnabled: boolean) {
	vi.mocked(draftMode).mockReturnValue(
		Promise.resolve({
			isEnabled,
			disable: () => void 0,
			enable: () => void 0,
		}),
	);
}

beforeEach<Fixtures>(({ client, activeCookie }) => {
	mockDraftMode(true);
	mockPreviewCookie(activeCookie);
	enableAutoPreviews({ client });
});

it("enables auto previews", async ({ client, activeCookie }) => {
	await client.get();
	expect(client.fetchFn).toHaveBeenCalledWith(
		expect.stringContaining(`ref=${encodeURIComponent(activeCookie)}`),
		expect.objectContaining({}),
	);
});

it("ignores inactive previews cookies", async ({ client, inactiveCookie }) => {
	mockPreviewCookie(inactiveCookie);
	await client.get();
	expect(client.fetchFn).toHaveBeenCalledWith(
		expect.not.stringContaining(`ref=${encodeURIComponent(inactiveCookie)}`),
		expect.objectContaining({}),
	);
});

it("does not enable previews if draft mode is disabled", async ({
	client,
	activeCookie,
}) => {
	mockDraftMode(false);
	await client.get();
	expect(client.fetchFn).toHaveBeenCalledWith(
		expect.not.stringContaining(`ref=${encodeURIComponent(activeCookie)}`),
		expect.objectContaining({}),
	);
});

it("does not enable previews if draftMode() throws", async ({
	client,
	activeCookie,
}) => {
	vi.mocked(draftMode).mockImplementation(() => {
		throw new Error();
	});
	await client.get();
	expect(client.fetchFn).toHaveBeenCalledWith(
		expect.not.stringContaining(`ref=${encodeURIComponent(activeCookie)}`),
		expect.objectContaining({}),
	);
});
