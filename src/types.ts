import { PreviewData, NextApiRequest, NextApiResponse } from "next";
import { LinkResolverFunction } from "@prismicio/helpers";
import { Client } from "@prismicio/client";

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
};

/**
 * Preview config for enabling previews with redirectToPreviewURL
 */
export type PreviewConfig<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TLinkResolverFunction extends LinkResolverFunction<any> = LinkResolverFunction,
> = {
	/**
	 * The `req` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	req: {
		query: NextApiRequest["query"];
	};

	/**
	 * The `res` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	res: {
		redirect: NextApiResponse["redirect"];
	};

	/**
	 * The Prismic client configured for the preview session's repository.
	 */
	client: Client;

	/**
	 * A Link Resolver used to resolve the previewed document's URL.
	 *
	 * @see To learn more about Link Resolver: {@link https://prismic.io/docs/core-concepts/link-resolver-route-resolver}
	 */
	linkResolver?: TLinkResolverFunction;

	/**
	 * The default redirect URL if a URL cannot be determined for the previewed document.
	 */
	defaultURL?: string;
};
