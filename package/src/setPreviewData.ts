import { NextApiResponse } from "next";

export type SetPreviewDataConfig = {
	req: {
		query: {
			token: string;
		};
	};
	res: {
		setPreviewData: NextApiResponse["setPreviewData"];
	};
};

export async function setPreviewData({
	req,
	res,
}: SetPreviewDataConfig): Promise<void> {
	if (req.query.token) {
		const { token: ref } = req.query;
		res.setPreviewData({ ref });
	}
}
