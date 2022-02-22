import { linkResolver, createClient } from "../../prismicio";
import { setPreviewData, redirectToPreviewURL } from "prismic-next";
import { NextApiRequest, NextApiResponse } from "next";

export default async (
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> => {
	const client = createClient({ req });

	await setPreviewData({ req, res });

	await redirectToPreviewURL({ req, res, client, linkResolver });
};
