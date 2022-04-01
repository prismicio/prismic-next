import { test, expect, fn } from "vitest";
import * as prismic from "@prismicio/client";

import { setPreviewData, SetPreviewDataConfig } from "../src";

test("sets preview data if req contains a `token` URL param", () => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {
				token: "ref",
			},
			cookies: {},
		},
		res: {
			setPreviewData: fn(),
		},
	};

	setPreviewData(config);

	expect(config.res.setPreviewData).toHaveBeenCalledWith({
		ref: config.req.query.token,
	});
});

test("sets preview data if req contains a Prismic preview cookie", () => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {},
			cookies: {
				[prismic.cookie.preview]: "ref",
			},
		},
		res: {
			setPreviewData: fn(),
		},
	};

	setPreviewData(config);

	expect(config.res.setPreviewData).toHaveBeenCalledWith({
		ref: config.req.cookies[prismic.cookie.preview],
	});
});

test("prioritizes `token` URL param over Prismic preview cookie", () => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {
				token: "tokenRef",
			},
			cookies: {
				[prismic.cookie.preview]: "cookieRef",
			},
		},
		res: {
			setPreviewData: fn(),
		},
	};

	setPreviewData(config);

	expect(config.res.setPreviewData).toHaveBeenCalledWith({
		ref: config.req.query.token,
	});
});

test("does not set preview data if req does not a `token` URL param or a Prismic preview cookie", () => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {},
			cookies: {},
		},
		res: {
			setPreviewData: fn(),
		},
	};

	setPreviewData(config);

	expect(config.res.setPreviewData).not.toHaveBeenCalled();
});
