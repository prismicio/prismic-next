import test from "ava";
import sinon from "sinon";
import { SetPreviewDataConfig, setPreviewData } from "../src";

test("setPreviewData sets PreviewData", (t) => {
	const config: SetPreviewDataConfig = {
		req: {
			query: {
				token: "qwerty",
			},
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
