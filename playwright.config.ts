import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import assert from "node:assert";

dotenv.config({ path: ".env.test.local" });

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
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: [
		{
			command: "npm run dev --prefix tests-app -- --turbo",
			port: 4321,
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
