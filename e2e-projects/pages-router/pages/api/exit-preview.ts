import { exitPreview } from "@prismicio/next/pages"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
	return exitPreview({ req, res })
}
