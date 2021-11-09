import test from "ava";
import { NextApiRequest, NextApiResponse } from "next";
import * as sinon from "sinon";
import * as prismic from "@prismicio/client";
import * as msw from "msw";
import * as mswNode from "msw/node";
import fetch from "node-fetch";

import {
	createPreviewEndpoint,
	PreviewConfig,
} from "../src/createPreviewEndpoint";

const server = mswNode.setupServer();
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

test("createPreviewEndpoint runs setPreviewData", async (t) => {
	const endpoint = prismic.getEndpoint("qwerty");
	const client = prismic.createClient(endpoint, { fetch });

	const documentId = "documentId";
	const token = "token";

	const config: PreviewConfig = {
		req: {
			query: {
				documentId,
				token,
			},
		},
		res: {
			setPreviewData: sinon.stub(),
			redirect: sinon.stub(),
		},
		client,
		linkResolver: (doc) => `/${doc.id}`,
	};

	server.use(
		msw.rest.get(endpoint, (_req, res, ctx) => {
			return res(ctx.json({}));
		}),
		msw.rest.get(`${endpoint}/documents/search`, (req, res, ctx) => {
			const predicate = req.url.searchParams.get("q");

			if (predicate === `[[at(document.id, "${documentId}")]]`) {
				return res(
					ctx.json({
						results: [
							{
								id: documentId,
								url: "url",
								slugs: [],
								data: {},
							},
						],
					}),
				);
			}
		}),
	);

	await createPreviewEndpoint(config);

	t.true(
		(config.res.setPreviewData as sinon.SinonStub).calledWith({
			ref: token,
		}),
	);

	t.true((config.res.redirect as sinon.SinonStub).calledWith("url"));
});
