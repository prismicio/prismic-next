"use client";

import * as React from "react";
import * as prismic from "@prismicio/client";
import Link, { LinkProps } from "next/link";

export type PrismicNextLinkProps = Omit<
	React.ComponentProps<typeof Link>,
	"field" | "document" | "href" | "rel"
> & {
	linkResolver?: prismic.LinkResolverFunction;
	rel?: string | prismic.AsLinkAttrsConfig["rel"];
} & (
		| {
				document: prismic.PrismicDocument | null | undefined;
				href?: never;
				field?: never;
		  }
		| {
				field: prismic.LinkField | null | undefined;
				href?: never;
				document?: never;
		  }
		| {
				href: LinkProps["href"];
				field?: prismic.LinkField | null | undefined;
				document?: never;
		  }
	);

export const PrismicNextLink = React.forwardRef<
	HTMLAnchorElement,
	PrismicNextLinkProps
>(function PrismicNextLink(
	{ field, document, linkResolver, ...restProps },
	ref,
): JSX.Element | null {
	const {
		href: computedHref,
		rel: computedRel,
		...attrs
	} = prismic.asLinkAttrs(field ?? document, {
		linkResolver,
		rel: typeof restProps.rel === "function" ? restProps.rel : undefined,
	});

	let rel: string | undefined = computedRel;
	if ("rel" in restProps && typeof restProps.rel !== "function") {
		rel = restProps.rel;
	}

	const href = ("href" in restProps ? restProps.href : computedHref) || "";

	return <Link ref={ref} {...attrs} {...restProps} href={href} rel={rel} />;
});
