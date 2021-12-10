import { NextApiResponse, NextApiRequest } from "next";

export type ExitPreviewParams = {
	res: {
		clearPreviewData: NextApiResponse["clearPreviewData"];
		redirect: NextApiResponse["redirect"];
	};
	req: {
		headers: {
			referer?: NextApiRequest["headers"]["referer"];
		};
	};
};

/**
 * @name exitPreview
 * @param config
 * @description Exits preview mode
 */
export function exitPreview(config: ExitPreviewParams) {
	const { req } = config;
	// Exit the current user from "Preview Mode". This function accepts no args.
	config.res.clearPreviewData();

	// console.log("preview data cleared");

	// if (req.headers.referer) {
	// 	const url = new URL(req.headers.referer);

	// 	if (url.pathname !== "/api/exit-preview") {
	// 		// Redirect the user to the referrer page.
	// 		config.res.redirect(req.headers.referer);
	// 	}
	// }

	config.res.redirect("/");
}
