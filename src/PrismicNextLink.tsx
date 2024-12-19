import { ComponentProps, ReactElement, forwardRef } from "react";
import Link from "next/link";
import {
	AsLinkAttrsConfig,
	LinkField,
	LinkResolverFunction,
	PrismicDocument,
	asLinkAttrs,
} from "@prismicio/client";

export type PrismicNextLinkProps = Omit<
	ComponentProps<typeof Link>,
	"field" | "document" | "href" | "rel"
> & {
	linkResolver?: LinkResolverFunction;
	rel?: string | AsLinkAttrsConfig["rel"];
} & (
		| {
				field: LinkField | null | undefined;
				document?: never;
				href?: never;
		  }
		| {
				field?: never;
				document: PrismicDocument | null | undefined;
				href?: never;
		  }
		| {
				field?: never;
				document?: never;
				href: ComponentProps<typeof Link>["href"];
		  }
	);

export const PrismicNextLink = forwardRef<
	HTMLAnchorElement,
	PrismicNextLinkProps
>(function PrismicNextLink(props, ref): ReactElement | null {
	const { field, document, linkResolver, children, ...restProps } = props;
	const {
		href: computedHref,
		rel: computedRel,
		...attrs
	} = asLinkAttrs(field ?? document, {
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
