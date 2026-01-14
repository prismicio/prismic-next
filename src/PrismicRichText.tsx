"use client";

import type { FC } from "react";
import {
	PrismicRichText as BasePrismicRichText,
	type PrismicRichTextProps as BasePrismicRichTextProps,
	type JSXMapSerializer,
} from "@prismicio/react";

import { PrismicImage } from "./PrismicImage";
import { PrismicLink } from "./PrismicLink";

/**
 * A map of rich text block types to React Components. It is used to render
 * rich text fields.
 *
 * @see Templating rich text fields {@link https://prismic.io/docs/fields/rich-text}
 */
export type RichTextComponents = JSXMapSerializer;

/**
 * Props for `<PrismicRichText>`.
 *
 * This component wraps `@prismicio/react`'s `<PrismicRichText>` with Next.js
 * optimized defaults for images and links.
 */
export type PrismicRichTextProps = Omit<
	BasePrismicRichTextProps,
	"components"
> & {
	components?: RichTextComponents;
};

/**
 * Default Next.js-optimized components for rich text rendering.
 *
 * These components use `<PrismicImage>` and `<PrismicLink>` from
 * `@prismicio/next` for optimized image and link rendering.
 */
export const defaultComponents: RichTextComponents = {
	image: ({ node, key }) => {
		const field = {
			url: node.url,
			alt: node.alt,
			dimensions: node.dimensions,
			id: "",
			copyright: node.copyright ?? null,
			edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
		};

		return (
			<p key={key} className="block-img">
				{node.linkTo ? (
					<PrismicLink field={node.linkTo}>
						<PrismicImage field={field} fallbackAlt="" />
					</PrismicLink>
				) : (
					<PrismicImage field={field} fallbackAlt="" />
				)}
			</p>
		);
	},
	hyperlink: ({ node, children, key }) => (
		<PrismicLink key={key} field={node.data}>
			{children}
		</PrismicLink>
	),
};

/**
 * Renders content from a Prismic rich text field as React components with
 * Next.js-optimized defaults for images and links.
 *
 * @example
 *
 * ```tsx
 * <PrismicRichText field={slice.primary.text} />;
 * ```
 *
 * @see Learn how to style rich text, use custom components, and use labels for
 *   custom formatting: {@link https://prismic.io/docs/fields/rich-text}
 */
export const PrismicRichText: FC<PrismicRichTextProps> = ({
	components,
	...restProps
}) => {
	const mergedComponents = { ...defaultComponents, ...components };
	return <BasePrismicRichText {...restProps} components={mergedComponents} />;
};
