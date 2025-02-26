import type { FC, ReactNode } from "react";
import Script from "next/script";
import { getToolbarSrc } from "@prismicio/client";

import { PrismicPreviewClient } from "./PrismicPreviewClient.js";

/** Props for `<PrismicPreview>`. */
export type PrismicPreviewProps = {
	/**
	 * The name of your Prismic repository. A Prismic Toolbar will be registered
	 * using this repository.
	 */
	repositoryName: string;

	/**
	 * The URL of your app's Prismic preview endpoint (default: `/api/preview`).
	 * This URL will be fetched on preview update events.
	 */
	updatePreviewURL?: string;

	/**
	 * The URL of your app's exit preview endpoint (default: `/api/exit-preview`).
	 * This URL will be fetched on preview exit events.
	 */
	exitPreviewURL?: string;

	/** Children to render adjacent to the Prismic Toolbar. */
	children?: ReactNode;
};

/**
 * React component that sets up Prismic Previews using the Prismic Toolbar. When
 * the Prismic Toolbar send events to the browser, such as on preview updates
 * and exiting, this component will automatically refresh the page with the
 * changes.
 *
 * This component can be wrapped around your app or added anywhere in your app's
 * tree. It must be rendered on every page.
 */
export const PrismicPreview: FC<PrismicPreviewProps> = async (props) => {
	const { repositoryName, children, ...otherProps } = props;

	// Need this to avoid the following Next.js build-time error:
	// You're importing a component that needs next/headers. That only works
	// in a Server Component which is not supported in the pages/ directory.
	const { draftMode } = await import("next/headers.js");

	const toolbarSrc = getToolbarSrc(repositoryName);
	const isDraftMode = (await draftMode()).isEnabled;

	return (
		<>
			{children}
			<PrismicPreviewClient
				repositoryName={repositoryName}
				isDraftMode={isDraftMode}
				{...otherProps}
			/>
			<Script src={toolbarSrc} strategy="lazyOnload" />
		</>
	);
};
