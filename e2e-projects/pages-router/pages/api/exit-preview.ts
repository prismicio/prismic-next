import type { NextApiRequest, NextApiResponse } from "next";
import { exitPreview } from "@prismicio/next/pages";

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
	return exitPreview({ req, res });
}
