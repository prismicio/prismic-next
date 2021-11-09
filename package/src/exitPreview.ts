import { NextApiResponse } from "next";

export async function exitPreview(_: any, res: NextApiResponse) {
	// Exit the current user from "Preview Mode". This function accepts no args.
	res.clearPreviewData();

	// Redirect the user back to the index page.
	res.writeHead(307, { Location: "/" });
	res.end();
}
