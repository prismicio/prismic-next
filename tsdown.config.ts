import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		index: "./src/index.ts",
		pages: "./src/pages/index.ts",
	},
	format: ["esm", "cjs"],
	platform: "neutral",
	unbundle: true,
	plugins: [
		{
			name: "next-navigation-specifier",
			resolveId(id) {
				if (id === "next/navigation") {
					return { id: "next/navigation", external: true };
				}
			},
		},
	],
	sourcemap: true,
	exports: false,
});
