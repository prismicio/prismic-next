import { ComponentProps, forwardRef } from "react";
import Link from "next/link";
import {
	AsLinkAttrsConfig,
	LinkField,
	LinkResolverFunction,
	PrismicDocument,
	asLinkAttrs,
} from "@prismicio/client";

import { resolveDefaultExport } from "./lib/resolveDefaultExport";

/**
 * Props for `<PrismicNextLink>`.
 *
 * Accepts either a Prismic Link `field`, a Prismic `document`, or a direct
 * `href`, but not more than one.
 */
export type PrismicNextLinkProps = Omit<
	ComponentProps<typeof Link>,
	"field" | "document" | "href" | "rel"
> & {
	/**
	 * A Link Resolver function to resolve URLs for Prismic documents.
	 *
	 * @see Link Resolver documentation: https://prismic.io/docs/route-resolver
	 */
	linkResolver?: LinkResolverFunction;

	/** The `rel` attribute for the link, or a function to compute it dynamically. */
	rel?: string | AsLinkAttrsConfig["rel"];
} & (
		| {
				/** A Prismic Link field to render as a link. */
				field: LinkField | null | undefined;
				document?: never;
				href?: never;
		  }
		| {
				field?: never;
				/** A Prismic document to render as a link using its URL. */
				document: PrismicDocument | null | undefined;
				href?: never;
		  }
		| {
				field?: never;
				document?: never;
				/** A direct URL to use as the link's `href`. */
				href: ComponentProps<typeof Link>["href"];
		  }
	);

/**
 * Renders a Next.js `<Link>` component from a Prismic Link field or document.
 *
 * @example
 *
 * ```tsx
 * import { PrismicNextLink } from "@prismicio/next";
 *
 * export function Header({
 * 	navigation,
 * }: {
 * 	navigation: NavigationDocument;
 * }) {
 * 	return (
 * 		<nav>
 * 			{navigation.data.links.map((item) => (
 * 				<PrismicNextLink key={item.link.id} field={item.link}>
 * 					{item.label}
 * 				</PrismicNextLink>
 * 			))}
 * 		</nav>
 * 	);
 * }
 * ```
 *
 * @param props - Props for the component, including either `field`, `document`,
 *   or `href`.
 *
 * @returns A Next.js Link component configured with the Prismic content's URL.
 *
 * @see Prismic Link fields: https://prismic.io/docs/link-content-relationship
 */
export const PrismicNextLink = forwardRef<
	HTMLAnchorElement,
	PrismicNextLinkProps
>(function PrismicNextLink(props, ref) {
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
});
