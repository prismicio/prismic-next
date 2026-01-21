"use client";

import { imgixLoader } from "./imgixLoader";
import { devMsg } from "./lib/devMsg";
import { resolveDefaultExport } from "./lib/resolveDefaultExport";
import type { ImageFieldImage } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import type { ImgixURLParams } from "imgix-url-builder";
import { buildURL } from "imgix-url-builder";
import type { ImageProps } from "next/image";
import Image from "next/image";
import type {
	ForwardRefExoticComponent,
	PropsWithoutRef,
	RefAttributes,
} from "react";
import { forwardRef } from "react";

/**
 * @deprecated Use `PrismicImage` instead.
 */
export { PrismicImage as PrismicNextImage };

/**
 * @deprecated Use `PrismicImageProps` instead.
 */
export type { PrismicImageProps as PrismicNextImageProps };

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

export type PrismicImageProps = Omit<ImageProps, "src" | "alt" | "loader"> & {
	/** The Prismic Image field or thumbnail to render. */
	field: ImageFieldImage | null | undefined;

	/**
	 * An object of Imgix URL API parameters to transform the image.
	 *
	 * @see https://docs.imgix.com/apis/rendering
	 */
	imgixParams?: { [P in keyof ImgixURLParams]: ImgixURLParams[P] | null };

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

	loader?: ImageProps["loader"] | null;
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
 *
 * @see To learn more about `next/image`, see: https://nextjs.org/docs/api-reference/next/image
 */
// The type annotation is necessary to avoid a type reference issue.
export const PrismicImage: ForwardRefExoticComponent<
	PropsWithoutRef<PrismicImageProps> & RefAttributes<HTMLImageElement>
> = forwardRef<HTMLImageElement, PrismicImageProps>(function PrismicImage(
	{
		field,
		imgixParams = {},
		alt,
		fallbackAlt,
		fill,
		width,
		height,
		fallback = null,
		loader = imgixLoader,
		...restProps
	},
	ref,
) {
	if (process.env.NODE_ENV === "development") {
		if (typeof alt === "string" && alt !== "") {
			console.warn(
				`[PrismicImage] The "alt" prop can only be used to declare an image as decorative by passing an empty string (alt="") but was provided a non-empty string. You can resolve this warning by removing the "alt" prop or changing it to alt="". For more details, see ${devMsg(
					"alt-must-be-an-empty-string",
				)}`,
			);
		}

		if (typeof fallbackAlt === "string" && fallbackAlt !== "") {
			console.warn(
				`[PrismicImage] The "fallbackAlt" prop can only be used to declare an image as decorative by passing an empty string (fallbackAlt="") but was provided a non-empty string. You can resolve this warning by removing the "fallbackAlt" prop or changing it to fallbackAlt="". For more details, see ${devMsg(
					"alt-must-be-an-empty-string",
				)}`,
			);
		}
	}

	if (!isFilled.imageThumbnail(field)) {
		return <>{fallback}</>;
	}

	const resolvedImgixParams = imgixParams;
	for (const x in imgixParams) {
		if (resolvedImgixParams[x as keyof typeof resolvedImgixParams] === null) {
			resolvedImgixParams[x as keyof typeof resolvedImgixParams] = undefined;
		}
	}

	const src = buildURL(field.url, imgixParams as ImgixURLParams);

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

	// A non-null assertion is required since we can't statically
	// know if an alt attribute is available.
	const resolvedAlt = (alt ?? (field.alt || fallbackAlt))!;

	if (
		process.env.NODE_ENV === "development" &&
		typeof resolvedAlt !== "string"
	) {
		console.error(
			`[PrismicImage] The following image is missing an "alt" property. Please add Alternative Text to the image in Prismic. To mark the image as decorative instead, add one of \`alt=""\` or \`fallbackAlt=""\`.`,
			src,
		);
	}

	const ResolvedImage = resolveDefaultExport(Image);

	return (
		<ResolvedImage
			ref={ref}
			src={src}
			width={fill ? undefined : resolvedWidth}
			height={fill ? undefined : resolvedHeight}
			alt={resolvedAlt}
			fill={fill}
			loader={loader === null ? undefined : loader}
			{...restProps}
		/>
	);
});
