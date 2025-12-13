import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";
import preserveDirectives from "rollup-preserve-directives";

import { dependencies, peerDependencies } from "./package.json";

function preserveSideEffects(moduleIds: string[]): Plugin {
	return {
		name: "preserve-side-effects",
		transform(_code, id) {
			if (moduleIds.some((moduleId) => id.includes(moduleId))) {
				return { moduleSideEffects: true };
			}
		},
	};
}

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
			plugins: [
				preserveSideEffects(["setGlobalConfig"]),
				typescript({ rootDir: "./src" }),
				preserveDirectives(),
			],
		},
	},
});
