import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { getToolbarSrc, cookie as prismicCookie } from "@prismicio/client";

/** Props for `<PrismicPreview>`. */
export type PrismicPreviewProps = {
	/**
	 * The name of your Prismic repository. A Prismic Toolbar will be registered
	 * using this repository.
	 */
	repositoryName: string;

	/**
	 * **Only used in the Pages Directory (/pages).**
	 *
	 * The URL of your app's Prismic preview endpoint (default: `/api/preview`).
	 * This URL will be fetched on preview update events.
	 */
	updatePreviewURL?: string;

	/**
	 * **Only used in the Pages Directory (/pages).**
	 *
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
export function PrismicPreview(props: PrismicPreviewProps): JSX.Element {
	const {
		repositoryName,
		updatePreviewURL = "/api/preview",
		exitPreviewURL = "/api/exit-preview",
		children,
	} = props;

	const router = useRouter();

	const toolbarSrc = getToolbarSrc(repositoryName);

	useEffect(() => {
		const { signal, abort } = new AbortController();

		window.addEventListener("prismicPreviewUpdate", onUpdate, { signal });
		window.addEventListener("prismicPreviewEnd", onEnd, { signal });

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
			globalThis
				.fetch(router.basePath + exitPreviewURL, { signal })
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

		function onUpdate() {
			start();
		}

		function start() {
			// We check for `res.redirected` rather than `res.ok`
			// since the update preview endpoint may redirect to a
			// 404 page. As long as it redirects, we know the
			// endpoint exists and at least attempted to set preview
			// data.
			globalThis
				.fetch(router.basePath + updatePreviewURL, { signal })
				.then((res) => {
					if (!res.redirected) {
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

		return () => abort();
	}, [exitPreviewURL, updatePreviewURL, repositoryName, router]);

	return (
		<>
			{children}
			<Script src={toolbarSrc} strategy="lazyOnload" />
		</>
	);
}

function getPreviewCookieRepositoryName() {
	const cookie = window.document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${prismicCookie.preview}=`))
		?.split("=")[1];

	return (decodeURIComponent(cookie ?? "").match(/"([^"]+)\.prismic\.io"/) ||
		[])[1];
}
