import type { NextApiResponseLike } from "./types"

/** Adds a cookie like the App Router's preview cookie, keeping Next.js's preview data cookies. */
export function appendCookie(res: NextApiResponseLike, cookie: string): void {
	const previous = res.getHeader("Set-Cookie") ?? []
	res.setHeader("Set-Cookie", [
		...[previous].flat().map(String),
		`${cookie}; Path=/; SameSite=None; Secure`,
	])
}
