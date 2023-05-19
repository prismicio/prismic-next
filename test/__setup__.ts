import { beforeAll, beforeEach, vi } from "vitest";
import { createMockFactory, MockFactory } from "@prismicio/mock";
import { Headers } from "node-fetch";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

declare module "vitest" {
	export interface TestContext {
		mock: MockFactory;
		appRoot: string;
	}
}

vi.stubGlobal("Headers", Headers);

beforeAll(async () => {
	await fs.mkdir(os.tmpdir(), { recursive: true });

	vi.spyOn(process, "cwd");
});

beforeEach(async (ctx) => {
	ctx.mock = createMockFactory({ seed: ctx.meta.name });
	ctx.appRoot = await fs.mkdtemp(
		path.join(os.tmpdir(), "@prismicio__next___cli"),
	);

	vi.clearAllMocks();

	await fs.mkdir(path.join(ctx.appRoot, "foo", "bar"), { recursive: true });
	vi.mocked(process.cwd).mockReturnValue(path.join(ctx.appRoot, "foo", "bar"));

	return async () => {
		await fs.rm(ctx.appRoot, { recursive: true });
	};
});

vi.mock("node:fs/promises", async () => {
	const memfs: typeof import("memfs") = await vi.importActual("memfs");

	return memfs.fs.promises;
});
