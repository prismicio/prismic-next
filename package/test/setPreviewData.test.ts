import test from "ava";
import * as sinon from "sinon";
import * as prismic from "@prismicio/client";
import * as msw from "msw";
import * as mswNode from "msw/node";
import { SetPreviewDataConfig, setPreviewData } from "../src/setPreviewData";
import { NextApiRequest } from "next";

const server = mswNode.setupServer();
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

test("setPreviewData sets PreviewData", async (t) => {
	const endpoint = prismic.getEndpoint("qwerty");
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

	server.use(
		msw.rest.get(endpoint, (_req, res, ctx) => {
			return res(ctx.json({}));
		}),
	);

	await setPreviewData(config);

	t.true(
		(config.res.setPreviewData as sinon.SinonStub).calledWith({
			ref: config.req.query.token,
		}),
	);
});
