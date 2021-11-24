import test from "ava";
import * as sinon from "sinon";
import { enableAutoPreviews, EnableAutoPreviewsConfig } from "../src";
import { NextApiRequest } from "next";
import * as prismicMock from "@prismicio/mock";

import * as prismic from "@prismicio/client";

test("enableAutoPreviews enables previews with req passed to it", (t) => {
	globalThis.fetch = sinon.stub();
	const config: EnableAutoPreviewsConfig = {
		client: sinon.stub(prismic.createClient("url")),
		req: {},
	};

	enableAutoPreviews(config);

	t.true(
		(config.client.enableAutoPreviewsFromReq as sinon.SinonStub).calledWith(
			config.req,
		),
	);
});

test("enableAutoPreviews enables previews with Context passed to it", (t) => {
	globalThis.fetch = sinon.stub();
	const config: EnableAutoPreviewsConfig<{ ref: string }> = {
		client: sinon.stub(prismic.createClient("url")),
		context: { previewData: { ref: "ref" } },
	};

	enableAutoPreviews(config);

	t.true(
		(config.client.queryContentFromRef as sinon.SinonStub).calledWith(
			config.context?.previewData?.ref,
		),
	);
});

// TODO check what happens if ref is undefined
