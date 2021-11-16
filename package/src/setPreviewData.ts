import { NextApiResponse, NextApiRequest } from "next";

export type PreviewConfig = {
	req: NextApiRequest;
	res: NextApiResponse;
};

export async function setPreviewData({
	req,
	res,
}: PreviewConfig): Promise<void> {
	const { token: ref } = req.query;

	res.setPreviewData({ ref });
}
