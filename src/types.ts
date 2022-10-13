import type { PreviewData, NextApiRequest } from "next";
import type { ClientConfig } from "@prismicio/client";

/**
 * Configuration for creating a Prismic client with automatic preview support in
 * Next.js apps.
 */
export type CreateClientConfig = {
	/**
	 * Preview data coming from Next.js context object. This context object comes
	 * from `getStaticProps` or `getServerSideProps`.
	 *
	 * Pass `previewData` when using outside a Next.js API endpoint.
	 */
	previewData?: PreviewData;

	/**
	 * A Next.js API endpoint request object.
	 *
	 * Pass a `req` object when using in a Next.js API endpoint.
	 */
	req?: NextApiRequest;
} & ClientConfig;
