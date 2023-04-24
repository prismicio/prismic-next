"use client";

import Image, { ImageProps } from "next/image";
import { buildURL, ImgixURLParams } from "imgix-url-builder";
import * as prismic from "@prismicio/client";

import { __PRODUCTION__ } from "./lib/__PRODUCTION__";
import { devMsg } from "./lib/devMsg";

import { imgixLoader } from "./imgixLoader";

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

export type PrismicNextImageProps = Omit<ImageProps, "src" | "alt"> & {
	/**
	 * The Prismic Image field or thumbnail to render.
	 */
	field: prismic.ImageFieldImage | null | undefined;

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

	/**
	 * Rendered when the field is empty. If a fallback is not given, `null` will
	 * be rendered.
	 */
	fallback?: React.ReactNode;
};

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
	fill,
	width,
	height,
	fallback = null,
	...restProps
}: PrismicNextImageProps): JSX.Element => {
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

	if (prismic.isFilled.imageThumbnail(field)) {
		const src = buildURL(field.url, imgixParams);

		const ar = field.dimensions.width / field.dimensions.height;

		const castedWidth = castInt(width);
		const castedHeight = castInt(height);

		let resolvedWidth = castedWidth ?? field.dimensions.width;
		let resolvedHeight = castedHeight ?? field.dimensions.height;

		if (castedWidth != null && castedHeight == null) {
			resolvedHeight = castedWidth / ar;
		} else if (castedWidth == null && castedHeight != null) {
			resolvedWidth = castedHeight * ar;
		}

		return (
			<Image
				src={src}
				width={fill ? undefined : resolvedWidth}
				height={fill ? undefined : resolvedHeight}
				// A non-null assertion is required since we
				// can't statically know if an alt attribute is
				// available.
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				alt={(alt ?? (field.alt || fallbackAlt))!}
				fill={fill}
				loader={imgixLoader}
				{...restProps}
			/>
		);
	} else {
		return <>{fallback}</>;
	}
};
