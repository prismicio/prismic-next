import test from "ava";
import * as sinon from "sinon";
import { exitPreview } from "../src";
import { ExitPreviewParams } from "../src";

const noop = () => {
	// noop
};

test("exitPreview runs clearPreviewData", async (t) => {
	const config: ExitPreviewParams = {
		res: {
			clearPreviewData: sinon.stub(),
			redirect: sinon.stub().callsFake(noop),
		},
		req: {
			headers: { referer: "https://example.com" },
		},
	};

	exitPreview(config);

	t.true((config.res.clearPreviewData as sinon.SinonStub).calledWith());
});

test("exitPreview runs clearPreviewData and redirects to the referrer page", async (t) => {
	const config: ExitPreviewParams = {
		res: {
			clearPreviewData: sinon.stub(),
			redirect: sinon.stub().callsFake(noop),
		},
		req: {
			headers: { referer: "https://example.com/page" },
		},
	};

	exitPreview(config);

	t.true(
		(config.res.redirect as sinon.SinonStub).calledWith(
			"https://example.com/page",
		),
	);
});

test("exitPreview runs clearPreviewData and redirects to the index page if the referrer was itself", async (t) => {
	const config: ExitPreviewParams = {
		res: {
			clearPreviewData: sinon.stub(),
			redirect: sinon.stub().callsFake(noop),
		},
		req: {
			headers: { referer: "https://example.com/api/exit-preview" },
		},
	};

	exitPreview(config);

	t.true((config.res.redirect as sinon.SinonStub).calledWith("/"));
});

test("exitPreview runs clearPreviewData and redirects to the index page if the referrer was undefined", async (t) => {
	const config: ExitPreviewParams = {
		res: {
			clearPreviewData: sinon.stub(),
			redirect: sinon.stub().callsFake(noop),
		},
		req: {
			headers: {},
		},
	};

	exitPreview(config);

	t.true((config.res.redirect as sinon.SinonStub).calledWith("/"));
});
