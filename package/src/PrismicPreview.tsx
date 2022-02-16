import React, { useEffect } from "react";
import { PrismicToolbar } from "@prismicio/react";
import { getCookie } from "../lib/getCookie";
import { useRouter } from "next/router";
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
	const { isPreview } = useRouter();

	useEffect(() => {
		const prismicCookie = extractPreviewRefRepositoryName(
			getCookie("io.prismic.preview", globalThis.document.cookie) as string,
		);

		const prismicPreviewUpdateFromCookie = async () => {
			if (prismicCookie && !isPreview) {
				await fetch(`${updatePreviewURL}?token=${prismicCookie}`);
				window.location.reload();
			}

			return;
		};

		const prismicPreviewUpdate = async (event: Event) => {
			if (isPrismicUpdateToolbarEvent(event)) {
				// Prevent the toolbar from reloading the page.
				event.preventDefault();
				// Update the preview cookie.
				await fetch(`${updatePreviewURL}?token=${event.detail.ref}`);

				// Reload the page with the updated token.
				window.location.reload();
			}
		};

		const prismicPreviewEnd = async (event: Event) => {
			event.preventDefault();
			await fetch(exitPreviewURL);
			window.location.reload();
		};

		if (window) {
			prismicPreviewUpdateFromCookie();
			window.addEventListener("prismicPreviewUpdate", prismicPreviewUpdate);

			window.addEventListener("prismicPreviewEnd", prismicPreviewEnd);
		}

		return () => {
			if (window) {
				window.removeEventListener(
					"prismicPreviewUpdate",
					prismicPreviewUpdate,
				);
				window.removeEventListener("prismicPreviewEnd", prismicPreviewEnd);
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
