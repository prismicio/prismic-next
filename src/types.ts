import type { PreviewData } from "next";
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
} & FlexibleNextRequestLikeOrNextApiRequestLike &
	ClientConfig;

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
	nextUrl: {
		searchParams: {
			get(name: string): string | null;
		};
	};
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
	// This method only exists in Next.js >= 13.4, thus it may not exist.
	setDraftMode?(options: { enable: boolean }): NextApiResponseLike;
	redirect(url: string): NextApiResponseLike;
	clearPreviewData(): NextApiResponseLike;
	status(statusCode: number): NextApiResponseLike;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	json(body: any): void;
	setPreviewData(data: object | string): NextApiResponseLike;
};

/**
 * @internal
 */
export type FlexibleNextRequestLikeOrNextApiRequestLike =
	| {
			/**
			 * The request object from a Next.js Route Handler or API Route.
			 *
			 * **Alias**: `req`
			 *
			 * @see Next.js Route Handler docs: \<https://beta.nextjs.org/docs/routing/route-handlers\>
			 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
			 */
			request: NextRequestLike | NextApiRequestLike;
	  }
	| {
			/**
			 * The request object from a Next.js Route Handler or API Route.
			 *
			 * **Alias**: `request`
			 *
			 * @see Next.js Route Handler docs: \<https://beta.nextjs.org/docs/routing/route-handlers\>
			 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
			 */
			req: NextRequestLike | NextApiRequestLike;
	  };

/**
 * @internal
 */
export type FlexibleNextRequestLike =
	| {
			/**
			 * The request object from a Next.js Route Handler.
			 *
			 * **Alias**: `req`
			 *
			 * @see Next.js Route Handler docs: \<https://beta.nextjs.org/docs/routing/route-handlers\>
			 */
			request: NextRequestLike;
	  }
	| {
			/**
			 * The request object from a Next.js Route Handler.
			 *
			 * **Alias**: `request`
			 *
			 * @see Next.js Route Handler docs: \<https://beta.nextjs.org/docs/routing/route-handlers\>
			 */
			req: NextRequestLike;
	  };

/**
 * @internal
 */
export type FlexibleNextApiRequestLike =
	| {
			/**
			 * The request object from a Next.js API route.
			 *
			 * **Alias**: `req`
			 *
			 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
			 */
			request: NextApiRequestLike;
	  }
	| {
			/**
			 * The request object from a Next.js API route.
			 *
			 * **Alias**: `request`
			 *
			 * @see Next.js API route docs: \<https://nextjs.org/docs/api-routes/introduction\>
			 */
			req: NextApiRequestLike;
	  };
