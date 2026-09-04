import { cookie as prismicCookie } from "@prismicio/client"

const epoch = new Date(0)

function expiresAttr(): string {
	return `Expires=${epoch.toUTCString()}`
}

/** Expired `Set-Cookie` values for both leftover `io.prismic.preview` shapes. */
export function expiredPreviewCookieHeaders(name = prismicCookie.preview): string[] {
	const expires = expiresAttr()

	return [
		`${name}=; Path=/; ${expires}; SameSite=Lax`,
		`${name}=; Path=/; ${expires}; SameSite=None; Secure`,
	]
}

/**
 * Expired `Set-Cookie` values for the App Router draft-mode cookie that `draftMode().disable()`
 * would clear. Next sets `__prerender_bypass` as Lax (not Secure) in development and SameSite=None;
 * Secure in production.
 */
export function expiredDraftModeCookieHeaders(): string[] {
	const expires = expiresAttr()
	const name = "__prerender_bypass"

	return [
		`${name}=; Path=/; ${expires}; SameSite=Lax; HttpOnly`,
		`${name}=; Path=/; ${expires}; SameSite=None; Secure; HttpOnly`,
	]
}

/** Expire Pages Router's signed preview data in development and production. */
export function expiredPreviewDataCookieHeaders(): string[] {
	return expiredPreviewCookieHeaders("__next_preview_data").map((header) => `${header}; HttpOnly`)
}
