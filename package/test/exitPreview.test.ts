import test from "ava";
import * as sinon from "sinon";
import { exitPreview } from "../src";
import { ExitPreviewParams } from "../src";

test("exitPreview runs clearPreviewData", async (t) => {
	// const res: NextApiResponse = { clearPreviewData: sinon.stub() };

	const config: ExitPreviewParams = {
		res: {
			clearPreviewData: sinon.stub(),
		},
	};

	exitPreview(config);

	t.true((config.res.clearPreviewData as sinon.SinonStub).calledWith());
});
