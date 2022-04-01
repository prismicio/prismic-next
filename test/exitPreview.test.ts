import { test, expect, fn } from "vitest";

import { exitPreview, ExitPreviewConfig } from "../src";

test("clears preview data", () => {
	const config: ExitPreviewConfig = {
		req: {
			headers: {
				referer: "https://example.com/foo",
			},
		},
		res: {
			clearPreviewData: fn(),
			redirect: fn().mockImplementation(() => void 0),
		},
	};

	exitPreview(config);

	expect(config.res.clearPreviewData).toHaveBeenCalled();
});

test("redirects to referrer if present", () => {
	const config: ExitPreviewConfig = {
		req: {
			headers: {
				referer: "https://example.com/foo",
			},
		},
		res: {
			clearPreviewData: fn(),
			redirect: fn().mockImplementation(() => void 0),
		},
	};

	exitPreview(config);

	expect(config.res.redirect).toHaveBeenCalledWith(config.req.headers.referer);
});

test("redirects to `/` if no referrer", () => {
	const config: ExitPreviewConfig = {
		req: {
			headers: {},
		},
		res: {
			clearPreviewData: fn(),
			redirect: fn().mockImplementation(() => void 0),
		},
	};

	exitPreview(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/");
});

test("redirects to `/` if referrer is exit preview api route", () => {
	const config: ExitPreviewConfig = {
		req: {
			headers: {
				referer: "https://example.com/foo",
			},
		},
		res: {
			clearPreviewData: fn(),
			redirect: fn().mockImplementation(() => void 0),
		},
		exitPreviewURL: "/foo",
	};

	exitPreview(config);

	expect(config.res.redirect).toHaveBeenCalledWith("/");
});
