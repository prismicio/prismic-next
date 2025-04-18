import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";
import preserveDirectives from "rollup-preserve-directives";

import { dependencies, peerDependencies } from "./package.json";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: {
				index: "./src/index.ts",
				pages: "./src/pages/index.ts",
			},
			formats: ["cjs"],
		},
		minify: false,
		sourcemap: true,
		rollupOptions: {
			output: {
				preserveModules: true,
				preserveModulesRoot: "./src",
			},
			external: [
				...Object.keys(dependencies),
				...Object.keys(peerDependencies),
			].map((name) => new RegExp(`^${name}(?:/.*)?$`)),
			plugins: [typescript({ rootDir: "./src" }), preserveDirectives()],
		},
	},
});
