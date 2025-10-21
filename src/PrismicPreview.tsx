import type { FC, ReactNode } from "react";
import Script from "next/script";
import { getToolbarSrc } from "@prismicio/client";

import { resolveDefaultExport } from "./lib/resolveDefaultExport";
import { PrismicPreviewClient } from "./PrismicPreviewClient";

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
 * Sets up Prismic Previews with the Prismic Toolbar in a Next.js App Router application.
 *
 * @param props - Props for the component, including your Prismic
 *   `repositoryName`.
 *
 * @returns A component that loads the Prismic Toolbar and handles preview
 *   updates.
 *
 * @example
 *
 * ```tsx
 * // src/app/layout.tsx
 * import { PrismicPreview } from "@prismicio/next";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <PrismicPreview repositoryName="your-repo-name">
 *           {children}
 *         </PrismicPreview>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @see Prismic preview setup: https://prismic.io/docs/previews-nextjs
 */
export const PrismicPreview: FC<PrismicPreviewProps> = async (props) => {
	const { repositoryName, children, ...otherProps } = props;

	// Need this to avoid the following Next.js build-time error:
	// You're importing a component that needs next/headers. That only works
	// in a Server Component which is not supported in the pages/ directory.
	const { draftMode } = await import("next/headers");

	const toolbarSrc = getToolbarSrc(repositoryName);
	const isDraftMode = (await draftMode()).isEnabled;

	const ResolvedScript = resolveDefaultExport(Script);

	return (
		<>
			{children}
			<PrismicPreviewClient
				repositoryName={repositoryName}
				isDraftMode={isDraftMode}
				{...otherProps}
			/>
			<ResolvedScript src={toolbarSrc} strategy="lazyOnload" />
		</>
	);
};
