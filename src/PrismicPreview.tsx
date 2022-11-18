import * as React from "react";
import { useRouter } from "next/router";
import Script from "next/script";

import { getPrismicPreviewCookie } from "./lib/getPrismicPreviewCookie";
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
	 *
	 * **Note**: If your `next.config.js` file contains a `basePath`, it is
	 * automatically included.
	 */
	updatePreviewURL?: string;

	/**
	 * The URL of your app's exit preview endpoint (default: `/api/exit-preview`).
	 * This URL will be fetched on preview exit events.
	 *
	 * **Note**: If your `next.config.js` file contains a `basePath`, it is
	 * automatically included.
	 */
	exitPreviewURL?: string;

	/**
	 * Children to render adjacent to the Prismic Toolbar. The Prismic Toolbar
	 * will be rendered last.
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
	updatePreviewURL = "/api/preview",
	exitPreviewURL = "/api/exit-preview",
}: PrismicPreviewProps): JSX.Element {
	const router = useRouter();

	const resolvedUpdatePreviewURL = router.basePath + updatePreviewURL;
	const resolvedExitPreviewURL = router.basePath + exitPreviewURL;

	React.useEffect(() => {
		/**
		 * Starts Preview Mode and refreshes the page's props.
		 */
		const startPreviewMode = async () => {
			// Start Next.js Preview Mode via the given preview API endpoint.
			const res = await globalThis.fetch(resolvedUpdatePreviewURL);

			// We check for `res.redirected` rather than `res.ok`
			// since the update preview endpoint may redirect to a
			// 404 page. As long as it redirects, we know the
			// endpoint exists and at least attempted to set
			// preview data.
			if (res.redirected) {
				globalThis.location.reload();
			} else {
				console.error(
					`[<PrismicPreview>] Failed to start or update Preview Mode using the "${resolvedUpdatePreviewURL}" API endpoint. Does it exist?`,
				);
			}
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
			const res = await globalThis.fetch(resolvedExitPreviewURL);

			if (res.ok) {
				globalThis.location.reload();
			} else {
				console.error(
					`[<PrismicPreview>] Failed to exit Preview Mode using the "${resolvedExitPreviewURL}" API endpoint. Does it exist?`,
				);
			}
		};

		if (router.isPreview) {
			// Register Prismic Toolbar event handlers.
			window.addEventListener(
				"prismicPreviewUpdate",
				handlePrismicPreviewUpdate,
			);
			window.addEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);
		} else {
			const prismicPreviewCookie = getPrismicPreviewCookie(
				globalThis.document.cookie,
			);

			if (prismicPreviewCookie) {
				// If a Prismic preview cookie is present, but Next.js Preview
				// Mode is not active, we must activate Preview Mode manually.
				//
				// This will happen when a visitor accesses the page using a
				// Prismic preview share link.

				/**
				 * Determines if the current location is a descendant of the app's base
				 * path.
				 *
				 * This is used to prevent infinite refrehes; when
				 * `isDescendantOfBasePath` is `false`, `router.isPreview` is also
				 * `false`.
				 *
				 * If the app does not have a base path, this should always be `true`.
				 */
				const locationIsDescendantOfBasePath = window.location.href.startsWith(
					window.location.origin + router.basePath,
				);

				const prismicPreviewCookieRepositoryName =
					getPreviewCookieRepositoryName(prismicPreviewCookie);

				if (
					locationIsDescendantOfBasePath &&
					prismicPreviewCookieRepositoryName === repositoryName
				) {
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
	}, [
		repositoryName,
		resolvedExitPreviewURL,
		resolvedUpdatePreviewURL,
		router.isPreview,
		router.basePath,
	]);

	return (
		<>
			{children}
			<Script
				src={`https://static.cdn.prismic.io/prismic.js?repo=${repositoryName}&new=true`}
				strategy="lazyOnload"
			/>
		</>
	);
}
