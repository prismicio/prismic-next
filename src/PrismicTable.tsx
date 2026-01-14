"use client";

import type { ComponentType, FC, ReactNode } from "react";
import {
	PrismicTable as BasePrismicTable,
	type PrismicTableProps as BasePrismicTableProps,
} from "@prismicio/react";
import type {
	TableField,
	TableFieldHead,
	TableFieldBody,
	TableFieldHeadRow,
	TableFieldBodyRow,
	TableFieldHeaderCell,
	TableFieldDataCell,
} from "@prismicio/client";

import type { RichTextComponents } from "./PrismicRichText";
import { defaultComponents } from "./PrismicRichText";

/**
 * Custom components for rendering table elements.
 */
export type TableComponents = {
	table?: ComponentType<{ table: TableField<"filled">; children: ReactNode }>;
	thead?: ComponentType<{ head: TableFieldHead; children: ReactNode }>;
	tbody?: ComponentType<{ body: TableFieldBody; children: ReactNode }>;
	tr?: ComponentType<{
		row: TableFieldHeadRow | TableFieldBodyRow;
		children: ReactNode;
	}>;
	th?: ComponentType<{ cell: TableFieldHeaderCell; children: ReactNode }>;
	td?: ComponentType<{ cell: TableFieldDataCell; children: ReactNode }>;
};

/**
 * Props for `<PrismicTable>`.
 *
 * This component wraps `@prismicio/react`'s `<PrismicTable>` with Next.js
 * optimized defaults for images and links in cell content.
 */
export type PrismicTableProps = Omit<BasePrismicTableProps, "components"> & {
	components?: RichTextComponents & TableComponents;
};

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
	const mergedComponents = { ...defaultComponents, ...components };
	return <BasePrismicTable {...restProps} components={mergedComponents} />;
};
