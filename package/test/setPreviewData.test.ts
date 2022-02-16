import test from "ava";
import sinon from "sinon";
import { SetPreviewDataConfig, setPreviewData } from "../src";
import * as prismic from "@prismicio/client";

test("setPreviewData sets PreviewData", (t) => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {
				token: "qwerty",
			},
			cookies: {},
		},
		res: {
			setPreviewData: sinon.stub(),
		},
	};

	setPreviewData(config);

	t.true(
		(config.res.setPreviewData as sinon.SinonStub).calledWith({
			ref: config.req.query.token,
		}),
	);
});

test("setPreviewData sets PreviewData from cookie", (t) => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {},
			cookies: {
				[prismic.cookie.preview]: "qwerty",
			},
		},
		res: {
			setPreviewData: sinon.stub(),
		},
	};

	setPreviewData(config);

	t.true(
		(config.res.setPreviewData as sinon.SinonStub).calledWith({
			ref: config.req.cookies[prismic.cookie.preview],
		}),
	);
});

test("setPreviewData prioritizes preview data from query.token", (t) => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {
				token: "query",
			},
			cookies: {
				[prismic.cookie.preview]: "cookie",
			},
		},
		res: {
			setPreviewData: sinon.stub(),
		},
	};

	setPreviewData(config);

	t.false(
		(config.res.setPreviewData as sinon.SinonStub).calledWith({
			ref: config.req.cookies[prismic.cookie.preview],
		}),
	);

	t.true(
		(config.res.setPreviewData as sinon.SinonStub).calledWith({
			ref: config.req.query.token,
		}),
	);
});
