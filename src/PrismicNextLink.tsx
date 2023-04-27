"use client";

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
				document: prismic.PrismicDocument | null | undefined;
				field?: never;
		  }
		| {
				field: prismic.LinkField | null | undefined;
				document?: never;
		  }
		| {
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
		href = "",
		rel: computedRel,
		...attrs
	} = prismic.asLinkAttrs(field ?? document, {
		linkResolver,
		rel: typeof restProps.rel === "function" ? restProps.rel : undefined,
	});

	let rel = computedRel;
	if ("rel" in restProps && typeof restProps.rel !== "function") {
		rel = restProps.rel;
	}

	return <Link ref={ref} href={href} {...attrs} {...restProps} rel={rel} />;
});
