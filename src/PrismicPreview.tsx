import Script from "next/script";
import { draftMode } from "next/headers";
import { useRouter as usePagesRouter } from "next/router";
import * as React from "react";
import * as prismic from "@prismicio/client";

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
 * and exiting, this component will automatically refresh the page with the
 * changes.
 *
 * This component can be wrapped around your app or added anywhere in your app's
 * tree. It must be rendered on every page.
 */
export function PrismicPreview({
	repositoryName,
	children,
	...props
}: PrismicPreviewProps): JSX.Element | Promise<JSX.Element> {
	const toolbarSrc = prismic.getToolbarSrc(repositoryName);
	let isDraftMode = false;

	const result = (
		<>
			{children}
			<PrismicPreviewClient
				repositoryName={repositoryName}
				isDraftMode={isDraftMode}
				{...props}
			/>
			<Script src={toolbarSrc} strategy="lazyOnload" />
		</>
	);

	// We need to check `draftMode()`, an async method, when running in the
	// App Router. The Pages Router does not support async components, so we
	// need to do some trickery to return a Promise in the App Router and
	// unwrapped JSX in the Pages Router.
	//
	// Alternatively, we could serve a special server-only
	// `<PrismicPreview>`, but that requires extra set up and depends on the
	// compiler to recognize the `react-server` entry point. It is an
	// undocumented feature that could be removed.
	let isAppRouter = true;
	try {
		usePagesRouter();
		isAppRouter = false;
	} catch {}

	if (isAppRouter) {
		return new Promise(async (res) => {
			isDraftMode = (await draftMode()).isEnabled;

			res(result);
		});
	}

	return result;
}
