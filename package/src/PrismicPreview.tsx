import React, { useEffect } from "react";
import { PrismicToolbar } from "@prismicio/react";

/**
 * Props for PrismicPreview, only required param is repositoryName which is the
 * name of your Prismic Repository
 */
type PrismicPreviewConfig = {
	repositoryName: string;
	children?: React.ReactNode;
	updatePreviewURL?: string;
	exitPreviewURL?: string;
};

const isPrismicUpdateToolbarEvent = (
	event: Event,
): event is CustomEvent<{ ref: string }> =>
	"detail" in event && typeof (event as CustomEvent).detail.ref === "string";

/**
 * Component that initiates the Prismic Tool bar from @prismicio/react. It uses
 * hooks to addEventListeners for Prismic Tool Bar updates. Optionally can be
 * wrapped around an entire Next.js app
 *
 * @param PrismicPreviewConfig -
 */
export function PrismicPreview({
	repositoryName,
	children,
	updatePreviewURL = "/api/preview",
	exitPreviewURL = "/api/exit-preview",
}: PrismicPreviewConfig): JSX.Element {
	useEffect(() => {
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
