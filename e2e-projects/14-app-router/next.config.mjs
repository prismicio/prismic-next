// @ts-check

/** @type {import("next").NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{ hostname: "images.prismic.io" }],
	},
};

export default nextConfig;
