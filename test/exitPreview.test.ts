import { test, expect, vi } from "vitest";

import { exitPreview, ExitPreviewConfig } from "../src";

test("clears preview data", () => {
	const config: ExitPreviewConfig = {
		res: {
			redirect: vi.fn().mockImplementation(() => config.res),
			clearPreviewData: vi.fn().mockImplementation(() => config.res),
			status: vi.fn().mockImplementation(() => config.res),
			json: vi.fn(),
			setPreviewData: vi.fn().mockImplementation(() => config.res),
		},
		req: {
			query: {},
			cookies: {},
		},
	};

	exitPreview(config);

	expect(config.res.clearPreviewData).toHaveBeenCalled();
});

test("responds with 205 status code and JSON success message", () => {
	const config: ExitPreviewConfig = {
		res: {
			redirect: vi.fn().mockImplementation(() => config.res),
			clearPreviewData: vi.fn().mockImplementation(() => config.res),
			status: vi.fn().mockImplementation(() => config.res),
			json: vi.fn(),
			setPreviewData: vi.fn().mockImplementation(() => config.res),
		},
		req: {
			query: {},
			cookies: {},
		},
	};

	exitPreview(config);

	expect(config.res.status).toHaveBeenCalledWith(205);
	expect(config.res.json).toHaveBeenCalledWith({ success: true });
});
