import { cookie as prismicCookie } from "@prismicio/client"
import { setPreviewData } from "@prismicio/next/pages"
import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
	res.setHeader("Set-Cookie", "unrelated=value; Path=/; HttpOnly; SameSite=Lax")
	const previewCookie = req.query.previewCookie
	if (typeof previewCookie === "string") {
		req.cookies[prismicCookie.preview] = previewCookie
	}

	setPreviewData({ req, res })
	if ("redirect" in req.query) {
		res.redirect("/preview-client-test")
		return
	}

	res.status(200).json({ ok: true })
}
