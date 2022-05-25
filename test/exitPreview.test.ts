import { test, expect, vi } from "vitest";

import { exitPreview, ExitPreviewConfig } from "../src";

test("clears preview data", () => {
	const config: ExitPreviewConfig = {
		res: {
			clearPreviewData: vi.fn(),
			json: vi.fn(),
		},
		req: {
			headers: {},
		},
	};

	exitPreview(config);

	expect(config.res.clearPreviewData).toHaveBeenCalled();
});

test("responds with JSON success message", () => {
	const config: ExitPreviewConfig = {
		res: {
			clearPreviewData: vi.fn(),
			json: vi.fn(),
		},
		req: {
			headers: {},
		},
	};

	exitPreview(config);

	expect(config.res.json).toHaveBeenCalledWith({ success: true });
});
