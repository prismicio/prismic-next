import React, { useEffect } from "react";
import { PrismicToolbar } from "@prismicio/react";
import { useRouter } from "next/router";

import { getCookie } from "../lib/getCookie";
import { extractPreviewRefRepositoryName } from "../lib/extractPreviewRefRepositoryName";

/**
 * Props for `<PrismicPreview>`.
 */
type PrismicPreviewProps = {
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
 * Determines if an Event object came from the Prismic Toolbar.
 *
 * @param event - Event to check.
 *
 * @returns `true` if `event` came from the Prismic Toolbar, `false` otherwise.
 */
const isPrismicUpdateToolbarEvent = (
	event: Event,
): event is CustomEvent<{ ref: string }> => {
	return (
		"detail" in event && typeof (event as CustomEvent).detail.ref === "string"
	);
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

	useEffect(() => {
		const previewRefRepositoryName = extractPreviewRefRepositoryName(
			getCookie("io.prismic.preview", globalThis.document.cookie) as string,
		);

		const startPreviewIfLoadedFromSharedLink = async () => {
			if (previewRefRepositoryName === repositoryName && !router.isPreview) {
				await fetch(updatePreviewURL);
				window.location.reload();
			}
		};

		startPreviewIfLoadedFromSharedLink();

		const handlePrismicPreviewUpdate = async (event: Event) => {
			if (isPrismicUpdateToolbarEvent(event)) {
				// Prevent the toolbar from reloading the page.
				event.preventDefault();

				// Start Next.js Preview Mode via the given preview API endpoint.
				await fetch(updatePreviewURL);

				// Reload the page with an active Preview Mode.
				window.location.reload();
			}
		};

		const handlePrismicPreviewEnd = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			// Exit Next.js Preview Mode via the given preview API endpoint.
			await fetch(exitPreviewURL);

			// Reload the page with an active Preview Mode.
			window.location.reload();
		};

		// Register Prismic Toolbar event handlers.
		if (window) {
			window.addEventListener(
				"prismicPreviewUpdate",
				handlePrismicPreviewUpdate,
			);
			window.addEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);
		}

		// On cleanup, unregister Prismic Toolbar event handlers.
		return () => {
			if (window) {
				window.removeEventListener(
					"prismicPreviewUpdate",
					handlePrismicPreviewUpdate,
				);
				window.removeEventListener(
					"prismicPreviewEnd",
					handlePrismicPreviewEnd,
				);
			}
		};
	}, []);

	return (
		<>
			<PrismicToolbar repositoryName={repositoryName} />
			{children}
		</>
	);
}
