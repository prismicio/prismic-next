import { cookie as prismicCookie } from "@prismicio/client"

const epoch = new Date(0)

/**
 * `cookies().set` options that expire both leftover shapes of `io.prismic.preview`: toolbar Lax
 * (not Secure) and the iframe write (SameSite=None; Secure).
 *
 * `cookies()` is name-keyed, so a Route Handler must also emit both `Set-Cookie` headers from
 * {@link expiredPreviewCookieHeaders}.
 */
export const expiredPreviewCookieSetOptions = [
	{
		path: "/",
		sameSite: "lax",
		secure: false,
		httpOnly: false,
		expires: epoch,
	},
	{
		path: "/",
		sameSite: "none",
		secure: true,
		httpOnly: false,
		expires: epoch,
	},
] as const

/** Expired `Set-Cookie` values for both leftover `io.prismic.preview` shapes. */
export function expiredPreviewCookieHeaders(name = prismicCookie.preview): string[] {
	const expires = `Expires=${epoch.toUTCString()}`

	return [
		`${name}=; Path=/; ${expires}; SameSite=Lax`,
		`${name}=; Path=/; ${expires}; SameSite=None; Secure`,
	]
}
