import { resolveDefaultExport } from "./lib/resolveDefaultExport";
import type {
	AsLinkAttrsConfig,
	LinkField,
	LinkResolverFunction,
	PrismicDocument,
} from "@prismicio/client";
import { asLinkAttrs } from "@prismicio/client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

/**
 * @deprecated Use `PrismicLink` instead.
 */
export { PrismicLink as PrismicNextLink } from "./PrismicLink";

/**
 * @deprecated Use `PrismicLinkProps` instead.
 */
export type { PrismicLinkProps as PrismicNextLinkProps } from "./PrismicLink";

export type PrismicLinkProps = Omit<
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

export const PrismicLink = forwardRef<HTMLAnchorElement, PrismicLinkProps>(
	function PrismicLink(props, ref) {
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

		const ResolvedLink = resolveDefaultExport(Link);

		return (
			<ResolvedLink ref={ref} {...attrs} {...restProps} href={href} rel={rel}>
				{"children" in props ? children : field?.text}
			</ResolvedLink>
		);
	},
);
