import { NextApiRequest, NextApiResponse } from "next";
import { setPreviewData, redirectToPreviewURL } from "@prismicio/next";
import { linkResolver, createPrismicClient } from "../../prismicio";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> {
	const client = createPrismicClient({ req });

	await setPreviewData({ req, res });

	await redirectToPreviewURL({ req, res, client, linkResolver });
}
