import { cookie as prismicCookie } from "@prismicio/client"

const epoch = new Date(0)

/** Expired `Set-Cookie` values for both leftover `io.prismic.preview` shapes. */
export function expiredPreviewCookieHeaders(name = prismicCookie.preview): string[] {
	const expires = `Expires=${epoch.toUTCString()}`

	return [
		`${name}=; Path=/; ${expires}; SameSite=Lax`,
		`${name}=; Path=/; ${expires}; SameSite=None; Secure`,
	]
}
