import Image, { ImageProps, ImageLoaderProps } from "next/image";
import { buildURL, ImgixURLParams } from "imgix-url-builder";
import * as prismicH from "@prismicio/helpers";
import * as prismicT from "@prismicio/types";

import { __PRODUCTION__ } from "./lib/__PRODUCTION__";
import { devMsg } from "./lib/devMsg";

const castInt = (input: string | number | undefined): number | undefined => {
	if (typeof input === "number" || typeof input === "undefined") {
		return input;
	} else {
		const parsed = Number.parseInt(input);

		if (Number.isNaN(parsed)) {
			return undefined;
		} else {
			return parsed;
		}
	}
};

/**
 * Creates a `next/image` loader for Imgix, which Prismic uses, with an optional
 * collection of default Imgix parameters.
 *
 * @see To learn about `next/image` loaders: https://nextjs.org/docs/api-reference/next/image#loader
 * @see To learn about Imgix's URL API: https://docs.imgix.com/apis/rendering
 */
const imgixLoader = (args: ImageLoaderProps): string => {
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

export type PrismicNextImageProps = Omit<
	ImageProps,
	"src" | "alt" | "width" | "height" | "layout"
> & {
	/**
	 * The Prismic Image field or thumbnail to render.
	 */
	field: prismicT.ImageFieldImage | null | undefined;

	/**
	 * An object of Imgix URL API parameters to transform the image.
	 *
	 * @see https://docs.imgix.com/apis/rendering
	 */
	imgixParams?: ImgixURLParams;

	/**
	 * Declare an image as decorative by providing `alt=""`.
	 *
	 * See:
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt#decorative_images
	 */
	alt?: "";

	/**
	 * Declare an image as decorative only if the Image field does not have
	 * alternative text by providing `fallbackAlt=""`.
	 *
	 * See:
	 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt#decorative_images
	 */
	fallbackAlt?: "";
} & (
		| ({
				layout?: "intrinsic" | "fixed";
		  } & Pick<ImageProps, "width" | "height">)
		| {
				layout: "responsive" | "fill";
		  }
	);

/**
 * React component that renders an image from a Prismic Image field or one of
 * its thumbnails using `next/image`. It will automatically set the `alt`
 * attribute using the Image field's `alt` property.
 *
 * It uses an Imgix URL-based loader by default. A custom loader can be provided
 * with the `loader` prop. If you would like to use the Next.js Image
 * Optimization API instead, set `loader={undefined}`.
 *
 * @param props - Props for the component.
 *
 * @returns A responsive image component using `next/image` for the given Image
 *   field.
 * @see To learn more about `next/image`, see: https://nextjs.org/docs/api-reference/next/image
 */
export const PrismicNextImage = ({
	field,
	imgixParams = {},
	alt,
	fallbackAlt,
	layout = "intrinsic",
	...restProps
}: PrismicNextImageProps) => {
	if (!__PRODUCTION__) {
		if (typeof alt === "string" && alt !== "") {
			console.warn(
				`[PrismicNextImage] The "alt" prop can only be used to declare an image as decorative by passing an empty string (alt="") but was provided a non-empty string. You can resolve this warning by removing the "alt" prop or changing it to alt="". For more details, see ${devMsg(
					"alt-must-be-an-empty-string",
				)}`,
			);
		}

		if (typeof fallbackAlt === "string" && fallbackAlt !== "") {
			console.warn(
				`[PrismicNextImage] The "fallbackAlt" prop can only be used to declare an image as decorative by passing an empty string (fallbackAlt="") but was provided a non-empty string. You can resolve this warning by removing the "fallbackAlt" prop or changing it to fallbackAlt="". For more details, see ${devMsg(
					"alt-must-be-an-empty-string",
				)}`,
			);
		}
	}

	if (prismicH.isFilled.imageThumbnail(field)) {
		const src = buildURL(field.url, imgixParams);
		const ar = field.dimensions.width / field.dimensions.height;

		let resolvedWidth = field.dimensions.width;
		let resolvedHeight = field.dimensions.height;

		if (
			(layout === "intrinsic" || layout === "fixed") &&
			("width" in restProps || "height" in restProps)
		) {
			const castedWidth = castInt(restProps.width);
			const castedHeight = castInt(restProps.height);

			if (castedWidth) {
				resolvedWidth = castedWidth;
			} else {
				if (castedHeight) {
					resolvedWidth = ar * castedHeight;
				}
			}

			resolvedHeight = resolvedWidth / ar;
		}

		return (
			<Image
				src={src}
				width={layout === "fill" ? undefined : resolvedWidth}
				height={layout === "fill" ? undefined : resolvedHeight}
				alt={alt ?? (field.alt || fallbackAlt)}
				loader={imgixLoader}
				layout={layout}
				{...restProps}
			/>
		);
	} else {
		return null;
	}
};
