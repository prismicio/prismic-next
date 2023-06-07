import { beforeEach, vi } from "vitest";
import { createMockFactory, MockFactory } from "@prismicio/mock";
import { Headers } from "node-fetch";

declare module "vitest" {
	export interface TestContext {
		mock: MockFactory;
	}
}

vi.stubGlobal("Headers", Headers);

beforeEach(async (ctx) => {
	ctx.mock = createMockFactory({ seed: ctx.meta.name });

	vi.clearAllMocks();
});
