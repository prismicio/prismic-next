"use client";

import * as React from "react";
import Script from "next/script";
import * as prismic from "@prismicio/client";

/**
 * Props for `<PrismicPreview>`.
 */
export type PrismicPreviewProps = {
	/**
	 * The name of your Prismic repository. A Prismic Toolbar will be registered
	 * using this repository.
	 */
	repositoryName: string;

	children?: React.ReactNode;
};

/**
 * React component that sets up Prismic Previews using the Prismic Toolbar. When
 * the Prismic Toolbar send events to the browser, such as on preview updates
 * and exiting, this component will automatically update Next.js Preview Mode
 * and refresh the page.
 *
 * This component can be wrapped around your app or added anywhere in your app's
 * tree. It must be rendered on every page.
 */
export function PrismicPreview({
	repositoryName,
	children,
}: PrismicPreviewProps): JSX.Element {
	const prismicToolbarSrc = prismic.getToolbarSrc(repositoryName);

	React.useEffect(() => {
		const handlePrismicPreviewUpdate = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			// TODO: Handle preview updates.

			// eslint-disable-next-line no-console
			console.log("[PrismicPreview]: Update event called.");
		};

		const handlePrismicPreviewEnd = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			// TODO: Handle preview exit.

			// eslint-disable-next-line no-console
			console.log("[PrismicPreview]: End event called.");
		};

		window.addEventListener("prismicPreviewUpdate", handlePrismicPreviewUpdate);
		window.addEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);

		return () => {
			window.removeEventListener(
				"prismicPreviewUpdate",
				handlePrismicPreviewUpdate,
			);
			window.removeEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);
		};
	}, []);

	return (
		<>
			{children}
			<Script src={prismicToolbarSrc} strategy="lazyOnload" />
		</>
	);
}
