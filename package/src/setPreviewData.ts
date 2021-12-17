import { NextApiResponse, NextApiRequest } from "next";

/**
 * SetPreviewDataConfig Accepts Next.js request object with the Prismic Token in
 * a query param and Next.js Response object.
 */
export type SetPreviewDataConfig = {
	req: {
		query: NextApiRequest["query"];
	};
	res: {
		setPreviewData: NextApiResponse["setPreviewData"];
	};
};

/**
 * Sets up Preview data based on token coming from query params.
 *
 * @param SetPreviewDataConfig -
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
