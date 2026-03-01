"use client";

import { PrismicImage } from "./PrismicImage";
import { PrismicLink } from "./PrismicLink";
import {
	PrismicRichText as BasePrismicRichText,
	type PrismicRichTextProps as BasePrismicRichTextProps,
	type RichTextComponents,
} from "@prismicio/react";
import type { FC } from "react";

/**
 * Props for `<PrismicRichText>`.
 */
export type PrismicRichTextProps = Omit<
	BasePrismicRichTextProps,
	"components"
> & {
	components?: RichTextComponents;
};

export const defaultComponents: RichTextComponents = {
	image: ({ node, key }) => {
		return (
			<p key={key} className="block-img">
				{node.linkTo ? (
					<PrismicLink field={node.linkTo}>
						<PrismicImage field={node} />
					</PrismicLink>
				) : (
					<PrismicImage field={node} />
				)}
			</p>
		);
	},
	hyperlink: ({ node, children }) => (
		<PrismicLink field={node.data}>{children}</PrismicLink>
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
 * @see {@link https://prismic.io/docs/fields/rich-text}
 */
export const PrismicRichText: FC<PrismicRichTextProps> = ({
	components,
	...restProps
}) => {
	return (
		<BasePrismicRichText
			components={{ ...defaultComponents, ...components }}
			{...restProps}
		/>
	);
};
