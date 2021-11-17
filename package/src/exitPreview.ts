import { NextApiResponse } from "next";

export type ExitPreviewParams = {
	res: {
		clearPreviewData: NextApiResponse["clearPreviewData"];
	};
};

export async function exitPreview(config: ExitPreviewParams): Promise<void> {
	// Exit the current user from "Preview Mode". This function accepts no args.
	config.res.clearPreviewData();

	// Redirect the user back to the index page.
	// config.res.writeHead(307, { Location: "/" });
	// config.res.end();
}
