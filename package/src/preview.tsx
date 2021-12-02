import React, { useEffect } from "react";

type PrismicPreviewConfig = {
	repoName: string;
	children: React.ReactChild[] | React.ReactChild;
	updatePreviewURL?: string;
	exitPreviewURL?: string;
};

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

		const prismicPreviewEnd = async (e: Event) => {
			e.preventDefault();
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
			<script
				data-prismic-toolbar=""
				data-repository-name={repoName}
				async
				defer
				src={`https://static.cdn.prismic.io/prismic.js?new=true&repo=${repoName}`}
			></script>
			{children}
		</React.Fragment>
	);
}
