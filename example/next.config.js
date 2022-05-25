/* eslint-disable tsdoc/syntax */

const prismic = require("@prismicio/client");

const sm = require("./sm.json");

/**
 * @type {import("next").NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,
	redirects: async () => {
		return [
			{
				source: "/admin",
				destination: `https://${prismic.getRepositoryName(
					sm.apiEndpoint,
				)}.prismic.io`,
				permanent: false,
			},
		];
	},
};

module.exports = nextConfig;
