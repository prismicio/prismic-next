"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type PrismicPreviewClientProps = {
	isDraftMode: boolean;
	hasCookieForRepository: boolean;
	updatePreviewURL?: string;
	exitPreviewURL?: string;
};

export function PrismicPreviewClient(props: PrismicPreviewClientProps): null {
	const {
		isDraftMode,
		hasCookieForRepository,
		updatePreviewURL = "/api/preview",
		exitPreviewURL = "/api/exit-preview",
	} = props;

	const { refresh } = useRouter();

	useEffect(() => {
		const { signal, abort } = new AbortController();

		window.addEventListener("prismicPreviewUpdate", onUpdate, { signal });
		window.addEventListener("prismicPreviewEnd", onEnd, { signal });

		// Start the preview for preview share links. Previews from
		// share links do not go to the `updatePreviewURL` like a normal
		// preview.
		if (hasCookieForRepository && !isDraftMode) {
			// We check for `res.redirected` rather than `res.ok`
			// since the update preview endpoint may redirect to a
			// 404 page. As long as it redirects, we know the
			// endpoint exists and at least attempted to set preview
			// data.
			globalThis
				.fetch(updatePreviewURL, { signal })
				.then((res) => {
					if (!res.redirected) {
						console.error(
							`[<PrismicPreview>] Failed to start the preview using "${updatePreviewURL}". Does it exist?`,
						);

						return;
					}

					refresh();
				})
				.catch(() => {
					// noop
				});
		}

		function onUpdate() {
			refresh();
		}

		function onEnd(event: Event) {
			event.preventDefault();
			globalThis
				.fetch(exitPreviewURL, { signal })
				.then((res) => {
					if (!res.ok) {
						console.error(
							`[<PrismicPreview>] Failed to exit Preview Mode using the "${exitPreviewURL}" API endpoint. Does it exist?`,
						);

						return;
					}

					refresh();
				})
				.catch(() => {
					// noop
				});
		}

		return () => abort();
	}, [
		hasCookieForRepository,
		isDraftMode,
		updatePreviewURL,
		exitPreviewURL,
		refresh,
	]);

	return null;
}
