import type { NextApiResponse, NextApiRequest } from "next";

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
	// `req` is no longer used in `exitPreview()`. It previously would
	// redirect the user to the referring URL, but it no longer has that
	// behavior.
	//
	// `req` is retained as a parameter to make setting up an exit preview
	// API route easier (this eliminates the awkward need to handle an
	// unused `req` param).
	//
	// It is also retained in case it is needed in the future, such as
	// reading headers or metadata about the request.
	req: {
		headers: NextApiRequest["headers"];
	};

	/**
	 * The `res` object from a Next.js API route. This is given as a parameter to
	 * the API route.
	 *
	 * @see Next.js API route docs: {@link https://nextjs.org/docs/api-routes/introduction}
	 */
	res: {
		clearPreviewData: NextApiResponse["clearPreviewData"];
		status: NextApiResponse["status"];
		json: NextApiResponse["json"];
	};

	/**
	 * @deprecated - This property is no longer used. It can be deleted safely.
	 */
	exitPreviewURL?: string;
};

/**
 * Exits Next.js's Preview Mode from within a Next.js API route.
 */
export function exitPreview(config: ExitPreviewConfig): void {
	// Exit the current user from Preview Mode.
	config.res.clearPreviewData();

	// 205 status is used to prevent CDN-level caching. The default 200
	// status code is typically treated as non-changing and cacheable.
	config.res.status(205).json({ success: true });
}
