import { ImageLoaderProps } from "next/image.js";
import { buildURL, ImgixURLParams } from "imgix-url-builder";

/**
 * A `next/image` loader for Imgix, which Prismic uses, with an optional
 * collection of default Imgix parameters.
 *
 * @see To learn about `next/image` loaders: https://nextjs.org/docs/api-reference/next/image#loader
 * @see To learn about Imgix's URL API: https://docs.imgix.com/apis/rendering
 */
export const imgixLoader = (args: ImageLoaderProps): string => {
	const url = new URL(args.src);

	const params: ImgixURLParams = {
		fit: (url.searchParams.get("fit") as ImgixURLParams["fit"]) || "max",
		w: args.width,
		h: undefined,
	};

	if (args.quality) {
		params.q = args.quality;
	}

	return buildURL(args.src, params);
};
