"use client";

import { cookie as prismicCookie } from "@prismicio/client";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useEffect } from "react";

type PrismicPreviewClientProps = {
	repositoryName: string;
	isDraftMode: boolean;
	updatePreviewURL?: string;
	exitPreviewURL?: string;
};

export const PrismicPreviewClient: FC<PrismicPreviewClientProps> = (props) => {
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
			// We check `opaqueredirect` because we don't care if
			// the redirect was successful or not. As long as it
			// redirects, we know the endpoint exists and draft mode
			// is active.
			globalThis
				.fetch(updatePreviewURL, {
					redirect: "manual",
					signal: controller.signal,
				})
				.then((res) => {
					if (res.type !== "opaqueredirect") {
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

		function onUpdate(event: Event) {
			event.preventDefault();
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
};

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
