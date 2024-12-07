"use client";

import { useEffect } from "react";
import { cookie as prismicCookie } from "@prismicio/client";
import { useRouter } from "next/navigation";

type PrismicPreviewClientProps = {
	repositoryName: string;
	isDraftMode: boolean;
	updatePreviewURL?: string;
	exitPreviewURL?: string;
};

export function PrismicPreviewClient(props: PrismicPreviewClientProps): null {
	const {
		repositoryName,
		isDraftMode,
		updatePreviewURL = "/api/preview",
		exitPreviewURL = "/api/exit-preview",
	} = props;

	const { refresh } = useRouter();

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener("prismicPreviewUpdate", onUpdate, {
			signal: controller.signal,
		});
		window.addEventListener("prismicPreviewEnd", onEnd, {
			signal: controller.signal,
		});

		const cookie = getPrismicPreviewCookie(window.document.cookie);
		const cookieRepositoryName = cookie
			? (decodeURIComponent(cookie).match(/"([^"]+)\.prismic\.io"/) || [])[1]
			: undefined;
		const hasCookieForRepository = cookieRepositoryName === repositoryName;

		// Start the preview for preview share links. Previews from
		// share links do not go to the `updatePreviewURL` like a normal
		// preview.
		if (hasCookieForRepository && !isDraftMode) {
			console.log("starting preview link");

			// We check for `res.redirected` rather than `res.ok`
			// since the update preview endpoint may redirect to a
			// 404 page. As long as it redirects, we know the
			// endpoint exists and at least attempted to set preview
			// data.
			globalThis
				.fetch(updatePreviewURL, { signal: controller.signal })
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
				.fetch(exitPreviewURL, { signal: controller.signal })
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

		return () => controller.abort();
	}, [repositoryName, isDraftMode, updatePreviewURL, exitPreviewURL, refresh]);

	return null;
}

/**
 * Returns the value of a cookie from a given cookie store.
 *
 * @param cookieJar - The stringified cookie store from which to read the
 *   cookie.
 *
 * @returns The value of the cookie, if it exists.
 */
function getPrismicPreviewCookie(cookieJar: string): string | undefined {
	function readValue(value: string): string {
		return value.replace(/%3B/g, ";");
	}

	const cookies = cookieJar.split("; ");

	let value: string | undefined;

	for (const cookie of cookies) {
		const parts = cookie.split("=");
		const name = readValue(parts[0]).replace(/%3D/g, "=");

		if (name === prismicCookie.preview) {
			value = readValue(parts.slice(1).join("="));
			continue;
		}
	}

	return value;
}
