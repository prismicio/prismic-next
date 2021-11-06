/**
 * @name updateNextPreview
 * @returns void
 * @description Handles updating the Next JS cookie with the correct preview URL
 */

export async function updateNextPreview(): Promise<void> {
	if (window) {
		window.addEventListener("prismicPreviewUpdate", async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			const detail = (event as CustomEvent<{ ref: string }>).detail;

			// Update the preview cookie.
			await fetch(`/api/preview?token=${detail.ref}`);

			// Reload the page with the updated token.
			window.location.reload();
		});
	}
}
