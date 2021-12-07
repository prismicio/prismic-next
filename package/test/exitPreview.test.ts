import test from "ava";
import * as sinon from "sinon";
import { exitPreview } from "../src";
import { ExitPreviewParams } from "../src";

test("exitPreview runs clearPreviewData", async (t) => {
	const config: ExitPreviewParams = {
		res: {
			clearPreviewData: sinon.stub(),
			redirect: sinon.stub(),
		},
	};

	exitPreview(config);

	t.true((config.res.clearPreviewData as sinon.SinonStub).calledWith());
});
