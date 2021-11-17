import test from "ava";
import * as sinon from "sinon";
import * as msw from "msw";
import * as mswNode from "msw/node";

import { exitPreview } from "../src/exitPreview";
import { ExitPreviewParams } from "../src/exitPreview";

const server = mswNode.setupServer();
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

test("exitPreview runs clearPreviewData", async (t) => {
	// const res: NextApiResponse = { clearPreviewData: sinon.stub() };

	const config: ExitPreviewParams = {
		res: {
			clearPreviewData: sinon.stub(),
		},
	};
	server.use(
		msw.rest.get("qwerty", (req, res, ctx) => {
			return res(ctx.json({}));
		}),
	);

	await exitPreview(config);

	t.true((config.res.clearPreviewData as sinon.SinonStub).calledWith());
});
