import type { NextApiRequest, NextApiResponse } from "next";
import { setPreviewData, redirectToPreviewURL } from "@prismicio/next/pages";
import assert from "node:assert";

import { createClient } from "@/prismicio";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
): Promise<void> {
	const repositoryName = req.cookies["repository-name"];
	assert(
		repositoryName && typeof repositoryName === "string",
		"A repository-name cookie is required.",
	);

	const client = createClient(repositoryName, {
		routes: [{ type: "page", path: "/:uid" }],
		req,
	});

	setPreviewData({ req, res });

	return await redirectToPreviewURL({ req, res, client });
}
