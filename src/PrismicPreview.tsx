import * as React from "react";
import * as prismic from "@prismicio/client";
import Script from "next/script";

import { PrismicPreviewClient } from "./PrismicPreviewClient";

/**
 * Props for `<PrismicPreview>`.
 */
export type PrismicPreviewProps = {
	/**
	 * The name of your Prismic repository. A Prismic Toolbar will be registered
	 * using this repository.
	 */
	repositoryName: string;

	/**
	 * **Only used in the Pages Directory (/pages).**
	 *
	 * The URL of your app's Prismic preview endpoint (default: `/api/preview`).
	 * This URL will be fetched on preview update events.
	 */
	updatePreviewURL?: string;

	/**
	 * **Only used in the Pages Directory (/pages).**
	 *
	 * The URL of your app's exit preview endpoint (default: `/api/exit-preview`).
	 * This URL will be fetched on preview exit events.
	 */
	exitPreviewURL?: string;

	/**
	 * Children to render adjacent to the Prismic Toolbar.
	 */
	children?: React.ReactNode;
};

/**
 * React component that sets up Prismic Previews using the Prismic Toolbar. When
 * the Prismic Toolbar send events to the browser, such as on preview updates
 * and exiting, this component will automatically update the Next.js preview
 * cookie and refresh the page.
 *
 * This component can be wrapped around your app or added anywhere in your app's
 * tree. It must be rendered on every page.
 */
export function PrismicPreview({
	repositoryName,
	children,
	...props
}: PrismicPreviewProps): JSX.Element {
	const toolbarSrc = prismic.getToolbarSrc(repositoryName);

	return (
		<>
			{children}
			<PrismicPreviewClient repositoryName={repositoryName} {...props} />
			<Script src={toolbarSrc} strategy="lazyOnload" />
		</>
	);
}
