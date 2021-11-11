import React, { useEffect } from "react";

type PrismicPreviewConfig = {
	repoName: string;
	children: React.ReactChild[] | React.ReactChild;
};

// TODO: removeEventListener for when component unmounts

export function PrismicPreview({ repoName, children }: PrismicPreviewConfig) {
	useEffect(() => {
		if (window) {
			window.addEventListener("prismicPreviewUpdate", async (event: Event) => {
				console.log("update fires");
				// Prevent the toolbar from reloading the page.
				event.preventDefault();

				const detail = (event as CustomEvent<{ ref: string }>).detail;

				// Update the preview cookie.
				await fetch(`/api/preview?token=${detail.ref}`);

				// Reload the page with the updated token.
				window.location.reload();
			});

			window.addEventListener("prismicPreviewEnd", async (event: Event) => {
				fetch("/api/exit-preview");
			});
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
