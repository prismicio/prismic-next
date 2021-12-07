import { NextApiResponse } from "next";

export type ExitPreviewParams = {
	res: {
		clearPreviewData: NextApiResponse["clearPreviewData"];
		redirect: NextApiResponse["redirect"];
	};
};

/**
 * @name exitPreview
 * @param config
 * @description Exits preview mode
 */
export function exitPreview(config: ExitPreviewParams) {
	// Exit the current user from "Preview Mode". This function accepts no args.
	config.res.clearPreviewData();

	// Redirect the user back to the index page.
	config.res.redirect("/");
	// config.res.writeHead(307, { Location: "/" });
	// config.res.end();
}
