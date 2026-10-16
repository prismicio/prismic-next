import { defineConfig } from "tsdown"

export default defineConfig({
	entry: {
		index: "./src/index.ts",
		// Next.js 13 and 14 compile any path matching `next/dist/pages` as their own
		// code, which breaks this package's ESM build, so the output can't live there.
		"router-pages": "./src/router-pages/index.ts",
	},
	format: ["esm", "cjs"],
	platform: "neutral",
	unbundle: true,
	// `next` has no `exports` field, so Node.js needs the `.js` extension on
	// `next/*` imports. tsdown 0.23 stopped adding it by default.
	deps: { resolveDepSubpath: true },
	plugins: [
		{
			// Next.js aliases `next/navigation` (not `next/navigation.js`) on the server.
			// Keep it bare only for the dynamic import in `redirectToPreviewURL`; static
			// imports get `.js` so Node.js can load the ESM build.
			name: "next-navigation-specifier",
			resolveId(id, _importer, { kind }) {
				if (id === "next/navigation" && kind === "dynamic-import") {
					return { id: "next/navigation", external: true }
				}
			},
		},
	],
	sourcemap: true,
	exports: false,
})
