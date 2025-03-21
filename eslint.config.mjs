// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import tsdoc from "eslint-plugin-tsdoc";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
	{
		ignores: ["dist/", "playwright-report/", "**/.next/"],
	},
	eslint.configs.recommended,
	tseslint.configs.recommended,
	prettier,
	// @ts-expect-error - Incompatible types
	react.configs.flat.recommended,
	// @ts-expect-error - Incompatible types
	react.configs.flat["jsx-runtime"],
	{
		settings: {
			react: {
				version: "detect",
			},
		},
		plugins: {
			tsdoc,
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"tsdoc/syntax": "warn",
		},
	},
);
