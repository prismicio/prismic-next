import { it, expect, vi, beforeAll, TestContext, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import { argv } from "./__testutils__/argv";

import { run } from "../src/cli";

beforeAll(() => {
	vi.spyOn(console, "info").mockImplementation(() => void 0);
	vi.spyOn(console, "warn").mockImplementation(() => void 0);
});

afterEach(() => {
	setUpApp.fileCount = 0;
});

type SetupAppArgs = {
	withPackageJSON?: boolean;
	withCachedFetches?: {
		kind: string;

		data: {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			body: any;
		};
	}[];
};

async function setUpApp(ctx: TestContext, args: SetupAppArgs = {}) {
	if (args.withPackageJSON ?? true) {
		await fs.writeFile(
			path.join(ctx.appRoot, "package.json"),
			JSON.stringify({}),
		);
	}

	if (args.withCachedFetches) {
		await fs.mkdir(path.join(ctx.appRoot, ".next/cache/fetch-cache"), {
			recursive: true,
		});

		for (const cachedFetch of args.withCachedFetches) {
			await fs.writeFile(
				path.join(
					ctx.appRoot,
					".next/cache/fetch-cache",
					(setUpApp.fileCount++).toString(),
				),
				JSON.stringify({
					...cachedFetch,
					data: {
						body: Buffer.from(JSON.stringify(cachedFetch.data.body)).toString(
							"base64",
						),
					},
				}),
			);
		}
	}
}
setUpApp.fileCount = 0;

it("warns that the cli is experimental", async () => {
	await run(argv("clear-cache"));

	expect(console.warn).toHaveBeenCalledWith(
		expect.stringMatching(/experimental/i),
	);
});

it("warns if an app root cannot be found", async () => {
	await run(argv("clear-cache"));

	expect(console.warn).toHaveBeenCalledWith(
		expect.stringMatching(/could not find the next.js app root/i),
	);
});

it("exits early if the fetch cache doesn't exist", async (ctx) => {
	await setUpApp(ctx);

	await run(argv("clear-cache"));

	expect(console.info).toHaveBeenCalledWith(
		expect.stringMatching(/no next.js fetch cache directory found/i),
	);
});

it("clears cached Prismic Rest API /api/v2 requests", async (ctx) => {
	await setUpApp(ctx, {
		withCachedFetches: [
			{
				kind: "FETCH",
				data: {
					body: {
						oauth_initiate: "https://example-prismic-repo.prismic.io/auth",
					},
				},
			},
		],
	});

	expect(
		await fs.readdir(path.join(ctx.appRoot, ".next/cache/fetch-cache")),
	).includes("0");

	await run(argv("clear-cache"));

	expect(
		await fs.readdir(path.join(ctx.appRoot, ".next/cache/fetch-cache")),
	).not.includes("0");

	expect(console.info).toHaveBeenCalledWith(
		expect.stringMatching(/\/api\/v2 request cache cleared/i),
	);
});

it("leaves non-Prismic Rest API V2 requests in the cache", async (ctx) => {
	await setUpApp(ctx, {
		withCachedFetches: [
			{
				kind: "FETCH",
				data: {
					body: {
						foo: "bar",
					},
				},
			},
			{
				kind: "FETCH",
				data: {
					body: {
						oauth_initiate: "https://example-prismic-repo.prismic.io/auth",
					},
				},
			},
			{
				kind: "FOO",
				data: {
					body: {
						baz: "qux",
					},
				},
			},
		],
	});

	const cacheDir = path.join(ctx.appRoot, ".next/cache/fetch-cache");

	const cacheEntriesPre = await fs.readdir(cacheDir);

	expect(cacheEntriesPre).includes("0");
	expect(cacheEntriesPre).includes("1");
	expect(cacheEntriesPre).includes("2");

	await run(argv("clear-cache"));

	const cacheEntriesPost = await fs.readdir(cacheDir);

	expect(cacheEntriesPost).includes("0");
	expect(cacheEntriesPost).not.includes("1");
	expect(cacheEntriesPost).includes("2");

	expect(console.info).toHaveBeenCalledWith(
		expect.stringMatching(/\/api\/v2 request cache cleared/i),
	);
});

it("prints success message after successful clearing", async (ctx) => {
	await setUpApp(ctx, { withCachedFetches: [] });

	await run(argv("clear-cache"));

	expect(console.info).toHaveBeenCalledWith(
		expect.stringMatching(/cache has been cleared/i),
	);
});
