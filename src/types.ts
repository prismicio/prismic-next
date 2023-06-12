import type { PreviewData } from "next";
import type { ClientConfig } from "@prismicio/client";

// Add Next.js-specific fetchOptions to `@prismicio/client`.
declare module "@prismicio/client" {
	interface RequestInitLike {
		next?: RequestInit["next"];
	}
}

/**
 * Prismic data saved in Next.js Preview Mode's object.
 */
export type PrismicPreviewData = {
	ref: string;
};

/**
 * Configuration for creating a Prismic client with automatic preview support in
 * Next.js apps.
 */
export type CreateClientConfig = ClientConfig & {
	/**
	 * **Only used in the Pages Directory (/pages).**
	 *
	 * The `previewData` object provided in the `getStaticProps()` or
	 * `getServerSideProps()` context object.
	 */
	previewData?: PreviewData;

	/**
	 * **Only used in the Pages Directory (/pages).**
	 *
	 * The `req` object from a Next.js API route.
	 *
	 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
	 */
	req?: NextApiRequestLike;
};

/**
 * The minimal set of properties needed from `next`'s `NextRequest` type.
 *
 * This request type is only compatible with Route Handlers defined in the `app`
 * directory.
 */
export type NextRequestLike = {
	headers: {
		get(name: string): string | null;
	};
	url: string;
	nextUrl: unknown;
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
