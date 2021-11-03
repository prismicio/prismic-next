import { NextApiResponse } from "next";

export async function exitPreview(_: undefined, res: NextApiResponse) {
	res.clearPreviewData();

	res.writeHead(307, { Location: "/" });
	res.end();
}
