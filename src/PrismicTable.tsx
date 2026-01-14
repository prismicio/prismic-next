"use client";

import { defaultComponents } from "./PrismicRichText";
import {
	PrismicTable as BasePrismicTable,
	type PrismicTableProps,
} from "@prismicio/react";
import type { FC } from "react";

/**
 * Renders content from a Prismic table field as React components with
 * Next.js-optimized defaults for images and links in cell content.
 *
 * @example
 *
 * ```tsx
 * <PrismicTable field={slice.primary.pricing_table} />;
 * ```
 *
 * @see Learn how to style tables and customize table element components:
 *   {@link https://prismic.io/docs/fields/table}
 */
export const PrismicTable: FC<PrismicTableProps> = ({
	components,
	...restProps
}) => {
	return (
		<BasePrismicTable
			components={{ ...defaultComponents, ...components }}
			{...restProps}
		/>
	);
};
