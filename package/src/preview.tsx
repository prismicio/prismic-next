import React, { useEffect } from "react";

type PrismicPreviewConfig = {
	repoName: string;
	children: React.ReactChild[] | React.ReactChild;
	updatePreviewURL?: string;
	exitPreviewURL?: string;
};

// TODO: removeEventListener for when component unmounts

export function PrismicPreview({
	repoName,
	children,
	updatePreviewURL = "/api/preview",
	exitPreviewURL = "/api/exit-preview",
}: PrismicPreviewConfig) {
	useEffect(() => {
		const prismicPreviewUpdate = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			const detail = (event as CustomEvent<{ ref: string }>).detail;

			// Update the preview cookie.
			await fetch(`${updatePreviewURL}?token=${detail.ref}`);

			// Reload the page with the updated token.
			window.location.reload();
		};

		const prismicPreviewEnd = (event: Event) => {
			fetch(exitPreviewURL);
			window.location.reload();
		};

		if (window) {
			window.addEventListener("prismicPreviewUpdate", prismicPreviewUpdate);

			window.addEventListener("prismicPreviewEnd", prismicPreviewEnd);

			return () => {
				window.removeEventListener(
					"prismicPreviewUpdate",
					prismicPreviewUpdate,
				);
				window.removeEventListener("prismicPreviewEnd", prismicPreviewEnd);
			};
		}
	}, []);
	return (
		<React.Fragment>
			<script
				async
				defer
				src={`https://static.cdn.prismic.io/prismic.js?new=true&repo=${repoName}`}
			></script>
			{children}
		</React.Fragment>
	);
}
