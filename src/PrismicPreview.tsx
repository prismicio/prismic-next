import { getToolbarSrc } from "@prismicio/client"
import Script from "next/script"
import type { FC, ReactNode } from "react"

import { resolveDefaultExport } from "./lib/resolveDefaultExport"
import { PrismicPreviewClient } from "./PrismicPreviewClient"

const ResolvedScript = resolveDefaultExport(Script)

/** Props for `<PrismicPreview>`. */
export type PrismicPreviewProps = {
	/**
	 * The name of your Prismic repository. A Prismic Toolbar will be registered using this
	 * repository.
	 */
	repositoryName: string

	/**
	 * The URL of your app's Prismic preview endpoint (default: `/api/preview`). This URL will be
	 * fetched on preview update events.
	 */
	updatePreviewURL?: string

	/**
	 * The URL of your app's exit preview endpoint (default: `/api/exit-preview`). This URL will be
	 * fetched on preview exit events.
	 */
	exitPreviewURL?: string

	/** Children to render adjacent to the Prismic Toolbar. */
	children?: ReactNode
}

/**
 * React component that sets up Prismic Previews using the Prismic Toolbar. When the Prismic Toolbar
 * send events to the browser, such as on preview updates and exiting, this component will
 * automatically refresh the page with the changes.
 *
 * This component can be wrapped around your app or added anywhere in your app's tree. It must be
 * rendered on every page.
 */
export const PrismicPreview: FC<PrismicPreviewProps> = async (props) => {
	const { repositoryName, updatePreviewURL = "/api/preview", children, ...otherProps } = props

	// Need this to avoid the following Next.js build-time error:
	// You're importing a component that needs next/headers. That only works
	// in a Server Component which is not supported in the pages/ directory.
	const { draftMode } = await import("next/headers")

	// TODO: Bump the `@prismicio/client` peer to `^7.23.0`, which adds `version`, and drop `overrides`.
	const toolbarSrc = getToolbarSrc(repositoryName, { version: 5 })
	const isDraftMode = (await draftMode()).isEnabled

	return (
		<>
			{children}
			<PrismicPreviewClient
				repositoryName={repositoryName}
				isDraftMode={isDraftMode}
				updatePreviewURL={updatePreviewURL}
				{...otherProps}
			/>
			<ResolvedScript src={toolbarSrc} strategy="lazyOnload" data-preview-url={updatePreviewURL} />
		</>
	)
}
