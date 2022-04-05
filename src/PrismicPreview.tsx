import * as React from "react";
import * as prismic from "@prismicio/client";
import { PrismicToolbar } from "@prismicio/react";
import { useRouter } from "next/router";

import { getCookie } from "./lib/getCookie";
import { extractPreviewRefRepositoryName } from "./lib/extractPreviewRefRepositoryName";

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
 * Updates (or starts) Next.js Preview Mode using a given API endpoint and
 * reloads the page.
 *
 * @param updatePreviewURL - The API endpoint that sets Preview Mode data.
 */
const updatePreviewMode = async (updatePreviewURL: string): Promise<void> => {
	// Start Next.js Preview Mode via the given preview API endpoint.
	const res = await globalThis.fetch(updatePreviewURL);

	if (res.ok) {
		// Reload the page with an active Preview Mode.
		window.location.reload();
	} else {
		console.error(
			`[<PrismicPreview>] Failed to start or update Preview Mode using the "${updatePreviewURL}" API endpoint. Does it exist?`,
		);
	}
};

/**
 * Exits Next.js Preview Mode using a given API endpoint and reloads the page.
 *
 * @param exitPreviewURL - The API endpoint that exits Preview Mode.
 */
const exitPreviewMode = async (exitPreviewURL: string): Promise<void> => {
	// Exit Next.js Preview Mode via the given exit preview API endpoint.
	const res = await globalThis.fetch(exitPreviewURL);

	if (res.ok) {
		// Reload the page with an inactive Preview Mode.
		window.location.reload();
	} else {
		console.error(
			`[<PrismicPreview>] Failed to exit Preview Mode using the "${exitPreviewURL}" API endpoint. Does it exist?`,
		);
	}
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
	updatePreviewURL = "/api/preview",
	exitPreviewURL = "/api/exit-preview",
	children,
}: PrismicPreviewProps): JSX.Element {
	const router = useRouter();

	const resolvedUpdatePreviewURL = router.basePath + updatePreviewURL;
	const resolvedExitPreviewURL = router.basePath + exitPreviewURL;

	React.useEffect(() => {
		/**
		 * The Prismic preview cookie.
		 */
		const previewCookie = getCookie(prismic.cookie.preview);

		/**
		 * Determines if the current Prismic preview session is for the repository
		 * configured for this instance of `<PrismicPreview>`.
		 */
		const prismicPreviewSessionIsForThisRepo = Boolean(
			previewCookie &&
				extractPreviewRefRepositoryName(previewCookie) === repositoryName,
		);

		/**
		 * Determines if the current location is a descendant of the app's base path.
		 *
		 * This is used to prevent infinite refrehes; when `isDescendantOfBasePath`
		 * is `false`, `router.isPreview` is also `false`.
		 *
		 * If the app does not have a base path, this should always be `true`.
		 */
		const locationIsDescendantOfBasePath = window.location.href.startsWith(
			window.location.origin + router.basePath,
		);

		/**
		 * Determines if the current user loaded the page from a share link.
		 *
		 * Currently, we can only deduce this by checking if router.isPreview is
		 * false (i.e. Preview Mode is inactive) and a Prismic preview cookie is present.
		 */
		const loadedFromShareLink = !router.isPreview && previewCookie;

		if (
			prismicPreviewSessionIsForThisRepo &&
			locationIsDescendantOfBasePath &&
			loadedFromShareLink
		) {
			updatePreviewMode(resolvedUpdatePreviewURL);

			return;
		}

		const handlePrismicPreviewUpdate = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();
			await updatePreviewMode(resolvedUpdatePreviewURL);
		};

		const handlePrismicPreviewEnd = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();
			await exitPreviewMode(resolvedExitPreviewURL);
		};

		// Register Prismic Toolbar event handlers.
		window.addEventListener("prismicPreviewUpdate", handlePrismicPreviewUpdate);
		window.addEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);

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
		resolvedUpdatePreviewURL,
		resolvedExitPreviewURL,
		router.isPreview,
		router.basePath,
	]);

	return (
		<>
			{children}
			<PrismicToolbar repositoryName={repositoryName} />
		</>
	);
}
