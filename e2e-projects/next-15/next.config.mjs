// Next 15 loads this file with Node's ESM loader. Importing the package here
// checks that Node can load it (see #105 and #129).
import "@prismicio/next"

/** @type {import("next").NextConfig} */
export default {
	images: { remotePatterns: [{ hostname: "images.prismic.io" }] },
}
