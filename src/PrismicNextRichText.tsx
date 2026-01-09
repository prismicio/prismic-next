import type { FC } from "react";
import { PrismicRichText } from "@prismicio/react";
import type { PrismicRichTextProps, JSXMapSerializer } from "@prismicio/react";

import { PrismicNextImage } from "./PrismicNextImage";
import { PrismicNextLink } from "./PrismicNextLink";

export type PrismicNextRichTextProps = Omit<
	PrismicRichTextProps,
	"components"
> & {
	components?: JSXMapSerializer;
};

const defaultComponents: JSXMapSerializer = {
	image: ({ node }) => (
		<p className="block-img">
			{node.linkTo ? (
				<PrismicNextLink field={node.linkTo}>
					<PrismicNextImage field={node} />
				</PrismicNextLink>
			) : (
				<PrismicNextImage field={node} />
			)}
		</p>
	),
	hyperlink: ({ node, children }) => (
		<PrismicNextLink field={node.data}>{children}</PrismicNextLink>
	),
};

export const PrismicNextRichText: FC<PrismicNextRichTextProps> = (props) => {
	const { components, ...restProps } = props;

	return (
		<PrismicRichText
			components={{ ...defaultComponents, ...components }}
			{...restProps}
		/>
	);
};
