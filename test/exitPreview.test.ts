import { expect, vi } from "vitest";

import { it } from "./it";

import { exitPreview } from "../src";

const draftModeDisableFn = vi.fn();

vi.mock("next/headers", () => ({
	draftMode: () => ({
		disable: draftModeDisableFn,
	}),
}));

it("disables draft mode", async () => {
	await exitPreview();
	expect(draftModeDisableFn).toHaveBeenCalled();
});

it("responds with a JSON success message and no-store Cache-Control header", async () => {
	const res = await exitPreview();
	expect(await res.json()).toStrictEqual({ success: true });
	expect(res.headers.get("cache-control")).toBe("no-store");
});
