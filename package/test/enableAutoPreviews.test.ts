import test from "ava";
import * as sinon from "sinon";
import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "../src";

test("enableAutoPreviews enables previews with req passed to it", (t) => {
	globalThis.fetch = sinon.stub();
	const config = {
		client: sinon.stub(prismic.createClient(prismic.getEndpoint("qwerty"))),
		req: {},
	};

	enableAutoPreviews(config);

	t.true(
		(config.client.enableAutoPreviewsFromReq as sinon.SinonStub).calledWith(
			config.req,
		),
	);
});

test("enableAutoPreviews enables previews with previewData passed to it", (t) => {
	globalThis.fetch = sinon.stub();
	const config = {
		client: sinon.stub(prismic.createClient(prismic.getEndpoint("qwerty"))),
		previewData: { ref: "ref" },
	};

	enableAutoPreviews(config);

	t.true(
		(config.client.queryContentFromRef as sinon.SinonStub).calledWith(
			config.previewData?.ref,
		),
	);
});
