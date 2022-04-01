import test from "ava";
import sinon from "sinon";
import prismic from "@prismicio/client";
import msw from "msw";
import mswNode from "msw/node";
import { PreviewConfig } from "../src/";
import { redirectToPreviewURL } from "../src";

const server = mswNode.setupServer();
test.before(() => server.listen({ onUnhandledRequest: "error" }));
test.after(() => server.close());

test("redirectToPreviewURL calls redirect", async (t) => {
	const endpoint = prismic.getEndpoint("qwerty");
	const client = prismic.createClient(endpoint, {
		fetch: (...args) =>
			import("node-fetch").then(({ default: fetch }) => fetch(...args)),
	});

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
			redirect: sinon.stub().callsFake(() => void 0),
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

	await redirectToPreviewURL(config);

	t.true((config.res.redirect as sinon.SinonStub).calledWith("/documentId"));
});

test("redirectToPreviewURL calls redirect only once", async (t) => {
	const endpoint = prismic.getEndpoint("qwerty");
	const client = prismic.createClient(endpoint, {
		fetch: (...args) =>
			import("node-fetch").then(({ default: fetch }) => fetch(...args)),
	});

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
			redirect: sinon.stub().callsFake(() => void 0),
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

	await redirectToPreviewURL(config);

	t.true((config.res.redirect as sinon.SinonStub).calledOnce);
});
