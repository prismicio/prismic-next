import typescript from "@rollup/plugin-typescript";
import { defineConfig, Plugin } from "vite";
import * as fs from "fs";

import pkg from "./package.json";

export default defineConfig({
	build: {
		lib: {
			entry: "./src/index.ts",
			formats: ["es", "cjs"],
			fileName: (format) => {
				switch (format) {
					case "es": {
						return "[name].js";
					}

					case "cjs": {
						return "[name].cjs";
					}
				}

				throw new Error(`Unsupported format: ${format}`);
			},
		},
		minify: false,
		rollupOptions: {
			external: [
				...Object.keys(pkg.dependencies),
				...Object.keys(pkg.peerDependencies),
				...Object.keys(pkg.devDependencies),
			].map((name) => new RegExp(`^${name}(?:\/.*)?$`)),
			output: {
				preserveModules: true,
				preserveModulesRoot: "src",
				inlineDynamicImports: false,
			},
			plugins: [
				typescript({
					rootDir: ".",
					declaration: true,
					declarationDir: "dist",
					include: ["./src/**/*"],
				}) as Plugin,
			],
		},
		sourcemap: true,
	},
	plugins: [
		{
			name: "move-dts",
			apply: "build",
			closeBundle: () => {
				// TODO: Replace with Node 14 compatible version
				fs.cpSync("./dist/src", "./dist", { recursive: true });
				fs.rmSync("./dist/src", { recursive: true });
			},
		},
	],
	test: {
		coverage: {
			reporter: ["lcovonly", "text"],
		},
	},
});
