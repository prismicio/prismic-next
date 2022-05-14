import * as React from "react";
import * as prismic from "@prismicio/client";
import { PrismicToolbar } from "@prismicio/react";
import { useRouter } from "next/router";

import { getCookie } from "./lib/getCookie";
import { getPreviewCookieRepositoryName } from "./lib/getPreviewCookieRepositoryName";

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
	 * The URL of your app's Prismic preview endpoint (default: `/api/preview`).
	 * This URL will be fetched on preview update events.
	 */
	updatePreviewURL?: string;

	/**
	 * The URL of your app's exit preview endpoint (default: `/api/exit-preview`).
	 * This URL will be fetched on preview exit events.
	 */
	exitPreviewURL?: string;

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
	updatePreviewURL = "/api/preview",
	exitPreviewURL = "/api/exit-preview",
}: PrismicPreviewProps): JSX.Element {
	const router = useRouter();

	React.useEffect(() => {
		/**
		 * Refreshes a page's props without reload the page. This function triggers
		 * the same API as navigating to a new page via `next/link`.
		 */
		const refreshPageProps = () => {
			router.replace(router.asPath);
		};

		/**
		 * Starts Preview Mode and refreshes the page's props.
		 */
		const startPreviewMode = async () => {
			// Start Next.js Preview Mode via the given preview API endpoint.
			await globalThis.fetch(updatePreviewURL);

			refreshPageProps();
		};

		const handlePrismicPreviewUpdate = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			await startPreviewMode();
		};

		const handlePrismicPreviewEnd = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			// Exit Next.js Preview Mode via the given preview API endpoint.
			await globalThis.fetch(exitPreviewURL);

			refreshPageProps();
		};

		const prismicPreviewCookie = getCookie(
			prismic.cookie.preview,
			globalThis.document.cookie,
		);

		if (prismicPreviewCookie) {
			if (router.isPreview) {
				// Register Prismic Toolbar event handlers.
				window.addEventListener(
					"prismicPreviewUpdate",
					handlePrismicPreviewUpdate,
				);
				window.addEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);
			} else {
				// If a Prismic preview cookie is present, but Next.js Preview
				// Mode is not active, we must activate Preview Mode manually.
				//
				// This will happen when a visitor accesses the page using a
				// Prismic preview share link.

				const prismicPreviewCookieRepositoryName =
					getPreviewCookieRepositoryName(prismicPreviewCookie);

				if (prismicPreviewCookieRepositoryName === repositoryName) {
					startPreviewMode();
				}
			}
		}

		// On cleanup, unregister Prismic Toolbar event handlers.
		return () => {
			window.removeEventListener(
				"prismicPreviewUpdate",
				handlePrismicPreviewUpdate,
			);
			window.removeEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);
		};
	}, [repositoryName, exitPreviewURL, updatePreviewURL, router.isPreview]);

	return (
		<>
			{children}
			<PrismicToolbar repositoryName={repositoryName} />
		</>
	);
}
