import React, { useEffect } from "react";

type PrismicPreviewConfig = {
	repositoryName: string;
	children?: React.ReactNode;
	updatePreviewURL?: string;
	exitPreviewURL?: string;
};

const isPrismicToolbarEvent = (
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
			if (isPrismicToolbarEvent(event)) {
				// Prevent the toolbar from reloading the page.
				event.preventDefault();
				// Update the preview cookie.
				await fetch(`${updatePreviewURL}?token=${event.detail.ref}`);

				// Reload the page with the updated token.
				window.location.reload();
			}
		};

		const prismicPreviewEnd = async (event: Event) => {
			if (isPrismicToolbarEvent(event)) {
				event.preventDefault();
				await fetch(exitPreviewURL);
				window.location.reload();
			}
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
			<script
				data-prismic-toolbar=""
				data-repository-name={repositoryName}
				async
				defer
				src={`https://static.cdn.prismic.io/prismic.js?new=true&repo=${repositoryName}`}
			></script>
			{children}
		</React.Fragment>
	);
}
