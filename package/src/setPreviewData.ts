import { NextApiResponse, NextApiRequest } from "next";

export type SetPreviewDataConfig = {
	req: {
		query: NextApiRequest["query"];
	};
	res: {
		setPreviewData: NextApiResponse["setPreviewData"];
	};
};

/**
 * @name setPreviewData
 * @description Sets preview data
 * @param SetPreviewDataConfig
 */
export async function setPreviewData({
	req,
	res,
}: SetPreviewDataConfig): Promise<void> {
	if (req.query.token) {
		const { token: ref } = req.query;
		res.setPreviewData({ ref });
	}
}
