import type { ClientConfig } from "@prismicio/client";

import { EnableAutoPreviewsConfig } from "./enableAutoPreviews";

/**
 * Configuration for creating a Prismic client with automatic preview support in
 * Next.js apps.
 */
export type CreateClientConfig = ClientConfig &
	Pick<EnableAutoPreviewsConfig, "previewData" | "req">;

/**
 * Prismic data saved in Next.js Preview Mode's object.
 */
export type PrismicPreviewData = {
	ref: string;
};

/**
 * The minimal set of properties needed from `next`'s `NextApiRequest` type.
 *
 * This request type is only compatible with API routes defined in the `pages`
 * directory.
 */
export type NextApiRequestLike = {
	query: Partial<Record<string, string | string[]>>;
	cookies: Partial<Record<string, string>>;
};

/**
 * The minimal set of properties needed from `next`'s `NextApiResponse` type.
 *
 * This request type is only compatible with API routes defined in the `pages`
 * directory.
 */
export type NextApiResponseLike = {
	redirect(url: string): NextApiResponseLike;
	clearPreviewData(): NextApiResponseLike;
	setHeader(name: string, value: string | string[]): NextApiResponseLike;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json(body: any): void;
	setPreviewData(data: object | string): NextApiResponseLike;
};
