import { getToolbarSrc, cookie as prismicCookie } from "@prismicio/client";
import { useRouter } from "next/router";
import Script from "next/script";
import type { FC } from "react";
import { type ReactNode, useEffect } from "react";

/** Props for `<PrismicPreview>`. */
export type PrismicPreviewProps = {
	/**
	 * The name of your Prismic repository. A Prismic Toolbar will be registered
	 * using this repository.
	 */
	repositoryName: string;

	/**
	 * The URL of your app's Prismic preview endpoint (default: `/api/preview`).
	 * This URL will be fetched on preview update events.
	 */
	updatePreviewURL?: string;

	/**
	 * The URL of your app's exit preview endpoint (default: `/api/exit-preview`).
	 * This URL will be fetched on preview exit events.
	 */
	exitPreviewURL?: string;

	/** Children to render adjacent to the Prismic Toolbar. */
	children?: ReactNode;
};

/**
 * React component that sets up Prismic Previews using the Prismic Toolbar. When
 * the Prismic Toolbar send events to the browser, such as on preview updates
 * and exiting, this component will automatically refresh the page with the
 * changes.
 *
 * This component can be wrapped around your app or added anywhere in your app's
 * tree. It must be rendered on every page.
 */
export const PrismicPreview: FC<PrismicPreviewProps> = (props) => {
	const {
		repositoryName,
		updatePreviewURL = "/api/preview",
		exitPreviewURL = "/api/exit-preview",
		children,
	} = props;

	const router = useRouter();

	const toolbarSrc = getToolbarSrc(repositoryName);

	useEffect(() => {
		const controller = new AbortController();

		window.addEventListener("prismicPreviewUpdate", onUpdate, {
			signal: controller.signal,
		});
		window.addEventListener("prismicPreviewEnd", onEnd, {
			signal: controller.signal,
		});

		// Start the preview for preview share links. Previews from
		// share links do not go to the `updatePreviewURL` like a normal
		// preview.
		//
		// We check that the current URL is a descendant of the base
		// path to prevent infinite refrehes.
		if (
			window.location.href.startsWith(
				window.location.origin + router.basePath,
			) &&
			getPreviewCookieRepositoryName() === repositoryName &&
			!router.isPreview
		) {
			start();
		}

		function onEnd(event: Event) {
			event.preventDefault();
			fetch(router.basePath + exitPreviewURL, { signal: controller.signal })
				.then((res) => {
					if (!res.ok) {
						console.error(
							`[<PrismicPreview>] Failed to exit Preview Mode using the "${exitPreviewURL}" API endpoint. Does it exist?`,
						);

						return;
					}

					refresh();
				})
				.catch(() => {});
		}

		function onUpdate(event: Event) {
			event.preventDefault();
			start();
		}

		function start() {
			// We check `opaqueredirect` because we don't care if
			// the redirect was successful or not. As long as it
			// redirects, we know the endpoint exists and at least
			// attempted to set preview data.
			fetch(router.basePath + updatePreviewURL, {
				redirect: "manual",
				signal: controller.signal,
			})
				.then((res) => {
					if (res.type !== "opaqueredirect") {
						console.error(
							`[<PrismicPreview>] Failed to start or update the preview using "${updatePreviewURL}". Does it exist?`,
						);

						return;
					}

					refresh();
				})
				.catch(() => {});
		}

		function refresh() {
			router.replace(router.asPath, undefined, { scroll: false });
		}

		return () => controller.abort();
	}, [exitPreviewURL, updatePreviewURL, repositoryName, router]);

	return (
		<>
			{children}
			<Script src={toolbarSrc} strategy="lazyOnload" />
		</>
	);
};

function getPreviewCookieRepositoryName() {
	const cookie = window.document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${prismicCookie.preview}=`))
		?.split("=")[1];

	return (decodeURIComponent(cookie ?? "").match(/"([^"]+)\.prismic\.io"/) ||
		[])[1];
}
