import React, { useEffect } from "react";
import { PrismicToolbar } from "@prismicio/react";

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

export function PrismicPreview({
	repositoryName,
	children,
	updatePreviewURL = "/api/preview",
	exitPreviewURL = "/api/exit-preview",
}: PrismicPreviewConfig) {
	useEffect(() => {
		const prismicPreviewUpdate = async (event: Event) => {
			console.log("run previewUpdate");
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
			console.log("prismic exit runs", event);
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
		<React.Fragment>
			<PrismicToolbar repositoryName={repositoryName} />
			{children}
		</React.Fragment>
	);
}
