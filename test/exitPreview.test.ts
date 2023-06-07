import { it, expect, vi, describe } from "vitest";

import { exitPreview, ExitPreviewConfig } from "../src";

const draftModeDisableFn = vi.fn();

vi.mock("next/headers", () => {
	return {
		draftMode() {
			return {
				disable: draftModeDisableFn,
			};
		},
	};
});

describe("App Router", () => {
	it("disables draft mode", async () => {
		await exitPreview();

		expect(draftModeDisableFn).toHaveBeenCalled();
	});

	it("responds with a JSON success message and no-store Cache-Control header", async () => {
		const res = await exitPreview();

		if (!res) {
			expect.fail(
				"The function did not return a response when it should have.",
			);
		}

		expect(await res.json()).toStrictEqual({ success: true });
		expect(res.headers.get("Cache-Control")).toBe("no-store");
	});
});

describe("Pages Router", () => {
	it("clears preview data", async () => {
		const config: ExitPreviewConfig = {
			res: {
				redirect: vi.fn().mockImplementation(() => config.res),
				clearPreviewData: vi.fn().mockImplementation(() => config.res),
				setHeader: vi.fn().mockImplementation(() => config.res),
				json: vi.fn(),
				setPreviewData: vi.fn().mockImplementation(() => config.res),
			},
			req: {
				query: {},
				cookies: {},
			},
		};

		await exitPreview(config);

		expect(config.res?.clearPreviewData).toHaveBeenCalled();
	});

	it("responds with a JSON success message and no-store Cache-Control header", async () => {
		const config: ExitPreviewConfig = {
			res: {
				redirect: vi.fn().mockImplementation(() => config.res),
				clearPreviewData: vi.fn().mockImplementation(() => config.res),
				setHeader: vi.fn().mockImplementation(() => config.res),
				json: vi.fn(),
				setPreviewData: vi.fn().mockImplementation(() => config.res),
			},
			req: {
				query: {},
				cookies: {},
			},
		};

		await exitPreview(config);

		expect(config.res?.json).toHaveBeenCalledWith({ success: true });
		expect(config.res?.setHeader).toHaveBeenCalledWith(
			"Cache-Control",
			"no-store",
		);
	});
});
