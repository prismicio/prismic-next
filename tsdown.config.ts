import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "./src/index.ts",
		pages: "./src/pages/index.ts",
		"react-server": "./src/simulator/react-server/index.ts",
	},
	format: "cjs",
	platform: "neutral",
	unbundle: true,
	sourcemap: true,
	exports: true,
});
