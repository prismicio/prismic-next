import { defineConfig, Plugin } from "vite";
import sdk from "vite-plugin-sdk";
import react from "@vitejs/plugin-react";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
	plugins: [
		sdk({
			internalDependencies: ["@prismicio/client"],
		}),
		react(),
	],
	build: {
		rollupOptions: {
			plugins: [preserveDirectives() as Plugin],
		},
	},
	test: {
		coverage: {
			provider: "v8",
			reporter: ["lcovonly", "text"],
		},
		setupFiles: ["./test/__setup__"],
	},
});
