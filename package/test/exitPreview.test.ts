import test from "ava";
import * as sinon from "sinon";
import * as msw from "msw";
import * as mswNode from "msw/node";
import fetch from "node-fetch";

import { exitPreview } from "../src/exitPreview";
import { NextApiResponse } from "next";

const server = mswNode.setupServer();
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

test("exitPreview runs clearPreviewData", async (t) => {
	// const res: NextApiResponse = { clearPreviewData: sinon.stub() };

	type ExitPreviewParams = {
		res: NextApiResponse;
		_: any;
	};

	const params = {
		res: {
			clearPreviewData: sinon.stub(),
		},
		_: "",
	};
	server.use(
		msw.rest.get("qwerty", (req, res, ctx) => {
			return res(ctx.json({}));
		}),
	);

	await exitPreview(params._, params.res);
});
