import { NextApiResponse, NextApiRequest } from "next";

/**
 * Configuration for `exitPreview`.
 */
export type ExitPreviewConfig = {
	/**
	 * The `req` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	req: {
		headers: {
			referer?: NextApiRequest["headers"]["referer"];
		};
	};

	/**
	 * The `res` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	res: {
		clearPreviewData: NextApiResponse["clearPreviewData"];
		redirect: NextApiResponse["redirect"];
	};

	/**
	 * The URL of your app's exit preview endpoint (default: `/api/exit-preview`).
	 *
	 * If the API route's referrer is the exit preview route (i.e. the route where
	 * you call `exitPreview()`), it will redirect to `/` instead of the referrer.
	 */
	exitPreviewURL?: string;
};

/**
 * Exits Next.js's Preview Mode from within a Next.js API route.
 *
 * If the user was sent to the endpoint from a page, the user will be redirected
 * back to that page after exiting Preview Mode.
 */
export function exitPreview(config: ExitPreviewConfig): void {
	const { req } = config;
	// Exit the current user from "Preview Mode". This function accepts no args.
	config.res.clearPreviewData();

	if (req.headers.referer) {
		const url = new URL(req.headers.referer);

		if (url.pathname !== (config.exitPreviewURL || "/api/exit-preview")) {
			// Redirect the user to the referrer page.
			config.res.redirect(req.headers.referer);

			return;
		}
	}

	config.res.redirect("/");
}
