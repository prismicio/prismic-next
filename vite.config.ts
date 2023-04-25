import { defineConfig, Plugin } from "vite";
import sdk from "vite-plugin-sdk";
import react from "@vitejs/plugin-react";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
	plugins: [sdk(), react()],
	build: {
		lib: {
			entry: {
				index: "./src/index.ts",
				"react-server": "./src/react-server/index.ts",
				"bin/prismic-next": "./src/bin/prismic-next.ts",
			},
		},
		rollupOptions: {
			plugins: [preserveDirectives() as Plugin],
		},
	},
	test: {
		coverage: {
			provider: "c8",
			reporter: ["lcovonly", "text"],
		},
		setupFiles: ["./test/__setup__"],
	},
});
