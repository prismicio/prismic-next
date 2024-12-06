import * as React from "react";
import * as prismic from "@prismicio/client";
import Link from "next/link";

export type PrismicNextLinkProps = Omit<
	React.ComponentProps<typeof Link>,
	"field" | "document" | "href" | "rel"
> & {
	linkResolver?: prismic.LinkResolverFunction;
	rel?: string | prismic.AsLinkAttrsConfig["rel"];
} & (
		| {
				field: prismic.LinkField | null | undefined;
				document?: never;
				href?: never;
		  }
		| {
				field?: never;
				document: prismic.PrismicDocument | null | undefined;
				href?: never;
		  }
		| {
				field?: never;
				document?: never;
				href: React.ComponentProps<typeof Link>["href"];
		  }
	);

export const PrismicNextLink = React.forwardRef<
	HTMLAnchorElement,
	PrismicNextLinkProps
>(function PrismicNextLink(props, ref): JSX.Element | null {
	const { field, document, linkResolver, children, ...restProps } = props;
	const {
		href: computedHref,
		rel: computedRel,
		...attrs
	} = prismic.asLinkAttrs(field ?? document, {
		linkResolver,
		rel: typeof restProps.rel === "function" ? restProps.rel : undefined,
	});

	const href = ("href" in restProps ? restProps.href : computedHref) || "";

	let rel = computedRel;
	if ("rel" in restProps && typeof restProps.rel !== "function") {
		rel = restProps.rel;
	}

	return (
		<Link ref={ref} {...attrs} {...restProps} href={href} rel={rel}>
			{"children" in props ? children : field?.text}
		</Link>
	);
});
