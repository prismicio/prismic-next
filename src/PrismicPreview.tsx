import type { ReactNode } from "react";
import { cookies, draftMode } from "next/headers";
import Script from "next/script";
import { getToolbarSrc, cookie as prismicCookie } from "@prismicio/client";

import { PrismicPreviewClient } from "./PrismicPreviewClient.js";

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
export async function PrismicPreview(
	props: PrismicPreviewProps,
): Promise<JSX.Element> {
	const { repositoryName, children, ...otherProps } = props;

	const toolbarSrc = getToolbarSrc(repositoryName);
	const isDraftMode = (await draftMode()).isEnabled;

	let hasCookieForRepository = false;
	if (isDraftMode) {
		const cookieJar = await cookies();
		const cookie = cookieJar.get(prismicCookie.preview)?.value;
		const cookieRepositoryName = cookie
			? (decodeURIComponent(cookie).match(/"([^"]+)\.prismic\.io"/) || [])[1]
			: undefined;
		hasCookieForRepository = cookieRepositoryName === repositoryName;
	}

	return (
		<>
			{children}
			<PrismicPreviewClient
				isDraftMode={isDraftMode}
				hasCookieForRepository={hasCookieForRepository}
				{...otherProps}
			/>
			<Script src={toolbarSrc} strategy="lazyOnload" />
		</>
	);
}
