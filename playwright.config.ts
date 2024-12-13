import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

dotenv.config({ path: ".env.test.local" });

export const STORAGE_STATE = fileURLToPath(
	new URL("./tests/.storage-state.json", import.meta.url),
);

// https://playwright.dev/docs/test-configuration
export default defineConfig({
	testDir: "./tests",
	testMatch: "**/*.spec.*",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		trace: "on-first-retry",
		storageState: STORAGE_STATE,
	},
	projects: [
		{
			name: "Setup",
			testMatch: "*.setup.*",
		},
		{
			name: "App Router",
			dependencies: ["Setup"],
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://localhost:4321",
			},
		},
		{
			name: "Pages Router",
			dependencies: ["Setup"],
			use: {
				...devices["Desktop Chrome"],
				baseURL: "http://localhost:4322",
			},
		},
	],
	webServer: [
		{
			command: "npm run dev --prefix e2e-projects/app-router",
			port: 4321,
			reuseExistingServer: !process.env.CI,
		},
		{
			command: "npm run dev --prefix e2e-projects/pages-router",
			port: 4322,
			reuseExistingServer: !process.env.CI,
		},
	],
});

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv {
			CI: boolean;
			PLAYWRIGHT_PRISMIC_USERNAME: string;
			PLAYWRIGHT_PRISMIC_PASSWORD: string;
		}
	}
}

assert.ok(
	process.env.PLAYWRIGHT_PRISMIC_USERNAME,
	"Missing PLAYWRIGHT_PRISMIC_USERNAME env variable.",
);
assert.ok(
	process.env.PLAYWRIGHT_PRISMIC_PASSWORD,
	"Missing PLAYWRIGHT_PRISMIC_PASSWORD env variable.",
);
