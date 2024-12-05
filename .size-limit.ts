import type { SizeLimitConfig } from "size-limit";
import { exports } from "./package.json";

module.exports = [
	{
		name: "@prismicio/next",
		path: exports["."].default,
	},
	{
		name: "@prismicio/next/pages",
		path: exports["./pages"].default,
	},
] satisfies SizeLimitConfig;
