import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	{
		extends: "./vite.config.ts",
		test: {
			name: "node",
			include: ["./test/**/*.test.ts"],
		},
	},
	{
		extends: "./vite.config.ts",
		test: {
			name: "browser",
			include: ["./test/**/*.test-browser.ts?(x)"],
			browser: {
				provider: "playwright",
				enabled: true,
				headless: true,
				name: "chromium",
				screenshotFailures: false,
			},
		},
	},
]);
