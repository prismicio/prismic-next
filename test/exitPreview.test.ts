import { test, expect, fn } from "vitest";

import { exitPreview, ExitPreviewConfig } from "../src";

test("clears preview data", () => {
	const config: ExitPreviewConfig = {
		res: {
			clearPreviewData: fn(),
			json: fn(),
		},
	};

	exitPreview(config);

	expect(config.res.clearPreviewData).toHaveBeenCalled();
});

test("responds with JSON success message", () => {
	const config: ExitPreviewConfig = {
		res: {
			clearPreviewData: fn(),
			json: fn(),
		},
	};

	exitPreview(config);

	expect(config.res.json).toHaveBeenCalledWith({ success: true });
});
