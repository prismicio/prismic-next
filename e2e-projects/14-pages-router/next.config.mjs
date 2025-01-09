// @ts-check

import { fileURLToPath } from "node:url";

/** @type {import("next").NextConfig} */
const nextConfig = {
	experimental: {
		outputFileTracingRoot: fileURLToPath(new URL("../..", import.meta.url)),
	},
	images: {
		remotePatterns: [{ hostname: "images.prismic.io" }],
	},
};

export default nextConfig;
