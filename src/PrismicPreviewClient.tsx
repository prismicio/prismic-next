"use client";

import { useEffect } from "react";
import { useRouter as usePagesRouter } from "next/router";
import { useRouter } from "next/navigation";

import { getPrismicPreviewCookie } from "./lib/getPrismicPreviewCookie";
import { getPreviewCookieRepositoryName } from "./lib/getPreviewCookieRepositoryName";

import { PrismicPreviewProps } from "./PrismicPreview";

type PrismicPreviewClientProps = Omit<PrismicPreviewProps, "children">;

export function PrismicPreviewClient({
	repositoryName,
	updatePreviewURL = "/api/preview",
	exitPreviewURL = "/api/exit-preview",
}: PrismicPreviewClientProps): null {
	let isAppRouter = true;
	let isPreviewMode = false;
	let basePath = "";
	let refresh: () => void;

	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const router = usePagesRouter();

		isAppRouter = false;
		basePath = router.basePath;
		isPreviewMode = router.isPreview;
		refresh = () => router.replace(router.asPath, undefined, { scroll: false });
	} catch {
		// Assume we are in App Router. Ignore the error.

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const router = useRouter();

		refresh = router.refresh;
	}

	useEffect(() => {
		/**
		 * Starts Preview Mode and refreshes the page's props.
		 */
		const startPreviewMode = async () => {
			const resolvedUpdatePreviewURL = basePath + updatePreviewURL;

			// Start Next.js Preview Mode via the given preview API endpoint.
			const res = await globalThis.fetch(resolvedUpdatePreviewURL);

			// We check for `res.redirected` rather than `res.ok`
			// since the update preview endpoint may redirect to a
			// 404 page. As long as it redirects, we know the
			// endpoint exists and at least attempted to set
			// preview data.
			if (res.redirected) {
				refresh();
			} else {
				console.error(
					`[<PrismicPreview>] Failed to start or update Preview Mode using the "${resolvedUpdatePreviewURL}" API endpoint. Does it exist?`,
				);
			}
		};

		const handlePrismicPreviewUpdate = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			if (isAppRouter) {
				refresh();
			} else {
				await startPreviewMode();
			}
		};

		const handlePrismicPreviewEnd = async (event: Event) => {
			// Prevent the toolbar from reloading the page.
			event.preventDefault();

			if (isAppRouter) {
				refresh();
			} else {
				const resolvedExitPreviewURL = basePath + exitPreviewURL;

				// Exit Next.js Preview Mode via the given preview API endpoint.
				const res = await globalThis.fetch(resolvedExitPreviewURL);

				if (res.ok) {
					// TODO: Can we do better than a full page reload?
					// globalThis.location.reload();
					refresh();
				} else {
					console.error(
						`[<PrismicPreview>] Failed to exit Preview Mode using the "${resolvedExitPreviewURL}" API endpoint. Does it exist?`,
					);
				}
			}
		};

		window.addEventListener("prismicPreviewUpdate", handlePrismicPreviewUpdate);
		window.addEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);

		if (!isPreviewMode) {
			const prismicPreviewCookie = getPrismicPreviewCookie(
				globalThis.document.cookie,
			);

			if (prismicPreviewCookie) {
				// If a Prismic preview cookie is present, but Next.js Preview
				// Mode is not active, we must activate Preview Mode manually.
				//
				// This will happen when a visitor accesses the page using a
				// Prismic preview share link.

				/**
				 * Determines if the current location is a descendant of the app's base
				 * path.
				 *
				 * This is used to prevent infinite refrehes; when
				 * `isDescendantOfBasePath` is `false`, `router.isPreview` is also
				 * `false`.
				 *
				 * If the app does not have a base path, this should always be `true`.
				 */
				const locationIsDescendantOfBasePath = window.location.href.startsWith(
					window.location.origin + basePath,
				);

				const prismicPreviewCookieRepositoryName =
					getPreviewCookieRepositoryName(prismicPreviewCookie);

				if (
					locationIsDescendantOfBasePath &&
					prismicPreviewCookieRepositoryName === repositoryName
				) {
					startPreviewMode();
				}
			}
		}

		return () => {
			window.removeEventListener(
				"prismicPreviewUpdate",
				handlePrismicPreviewUpdate,
			);
			window.removeEventListener("prismicPreviewEnd", handlePrismicPreviewEnd);
		};
	}, [
		basePath,
		exitPreviewURL,
		isAppRouter,
		isPreviewMode,
		refresh,
		repositoryName,
		updatePreviewURL,
	]);

	return null;
}
