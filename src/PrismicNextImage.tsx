"use client";

import {
	forwardRef,
	ForwardRefExoticComponent,
	PropsWithoutRef,
	RefAttributes,
} from "react";
import Image, { ImageProps } from "next/image";
import { buildURL, ImgixURLParams } from "imgix-url-builder";
import { ImageFieldImage, isFilled } from "@prismicio/client";

import { devMsg } from "./lib/devMsg";
import { resolveDefaultExport } from "./lib/resolveDefaultExport";

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

export type PrismicNextImageProps = Omit<
	ImageProps,
	"src" | "alt" | "loader"
> & {
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
 * Renders an optimized image from a Prismic Image field using Next.js
 * `<Image>`.
 *
 * @example
 *
 * ```tsx
 * import { PrismicNextImage } from "@prismicio/next";
 *
 * export function HeroSection({ page }: { page: PageDocument }) {
 * 	return (
 * 		<PrismicNextImage
 * 			field={page.data.hero_image}
 * 			imgixParams={{ q: 90 }}
 * 			priority
 * 		/>
 * 	);
 * }
 * ```
 *
 * @param props - Props for the component, including the Prismic Image `field`
 *   and optional `imgixParams` for image transformations.
 *
 * @returns An optimized Next.js Image component with automatic `alt` text from
 *   the Prismic field.
 *
 * @see Next.js Image component: https://nextjs.org/docs/app/api-reference/components/image
 * @see Imgix URL parameters: https://docs.imgix.com/apis/rendering
 */
// The type annotation is necessary to avoid a type reference issue.
export const PrismicNextImage: ForwardRefExoticComponent<
	PropsWithoutRef<PrismicNextImageProps> & RefAttributes<HTMLImageElement>
> = forwardRef<HTMLImageElement, PrismicNextImageProps>(
	function PrismicNextImage(
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
				`[PrismicNextImage] The following image is missing an "alt" property. Please add Alternative Text to the image in Prismic. To mark the image as decorative instead, add one of \`alt=""\` or \`fallbackAlt=""\`.`,
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
	},
);
