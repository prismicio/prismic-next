import type { APIRequestContext } from "@playwright/test"

import { expect, test } from "./infra"

type PreviewRefResponse = {
	draftModeEnabled: boolean
	previewRef: string | null
}

async function getPreviewRef(request: APIRequestContext): Promise<PreviewRefResponse> {
	const response = await request.get("/api/get-preview-ref-test")
	expect(response.ok()).toBe(true)
	return await response.json()
}

async function setupPreviewRef(
	request: APIRequestContext,
	config: { mode: "enable" | "disable"; previewCookie?: string },
): Promise<void> {
	const searchParams = new URLSearchParams({ mode: config.mode })
	if (config.previewCookie !== undefined) {
		searchParams.set("previewCookie", config.previewCookie)
	}

	const response = await request.get(`/api/get-preview-ref-test?${searchParams}`)
	expect(response.ok()).toBe(true)
}

test.describe("getPreviewRef", () => {
	test("keeps Draft Mode enabled for cross-site iframe requests in development", async ({
		request,
	}) => {
		const response = await request.get(
			"/api/get-preview-ref-test?mode=bootstrap&token=opaque-preview-ref",
			{ maxRedirects: 0 },
		)
		expect(response.status()).toBe(307)
		const setCookies = response
			.headersArray()
			.filter((header) => header.name.toLowerCase() === "set-cookie")
		for (const name of ["io.prismic.preview", "__prerender_bypass"]) {
			const cookie = setCookies.find((header) => header.value.startsWith(`${name}=`))?.value
			expect(cookie).toMatch(/; SameSite=None/i)
			expect(cookie).toMatch(/; Secure/i)
		}
		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: true,
			previewRef: "opaque-preview-ref",
		})
	})

	test("exits the standard preview bootstrap and removes both preview cookies", async ({
		request,
	}) => {
		await request.get("/api/get-preview-ref-test?mode=bootstrap&token=opaque-preview-ref")
		const response = await request.get("/api/exit-preview")
		expect(response.ok()).toBe(true)
		const cookieNames = (await request.storageState()).cookies.map((cookie) => cookie.name)
		expect(cookieNames).not.toContain("io.prismic.preview")
		expect(cookieNames).not.toContain("__prerender_bypass")
		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: false,
			previewRef: null,
		})
	})

	const toolbarPreviewRef = "m-master-ref:p-overlay-ref"
	const toolbarCookie = JSON.stringify({
		_tracker: "https://example.prismic.io",
		"example.prismic.io": { preview: toolbarPreviewRef },
	})

	for (const previewCookie of [
		"websitePreviewId=legacy-preview-ref",
		"m-master-ref:p-overlay-ref",
		"opaque-preview-ref",
	]) {
		test(`returns ${previewCookie} when Draft Mode is enabled`, async ({ request }) => {
			await setupPreviewRef(request, { mode: "enable", previewCookie })

			await expect(getPreviewRef(request)).resolves.toEqual({
				draftModeEnabled: true,
				previewRef: previewCookie,
			})
		})
	}

	test("unwraps the toolbar JSON preview cookie when Draft Mode is enabled", async ({
		request,
	}) => {
		await setupPreviewRef(request, { mode: "enable", previewCookie: toolbarCookie })

		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: true,
			previewRef: toolbarPreviewRef,
		})
	})

	test("returns null when the preview cookie is JSON without a preview field", async ({
		request,
	}) => {
		await setupPreviewRef(request, {
			mode: "enable",
			previewCookie: JSON.stringify({ "example.prismic.io": {} }),
		})

		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: true,
			previewRef: null,
		})
	})

	test("returns null when the preview cookie is a JSON array", async ({ request }) => {
		await setupPreviewRef(request, {
			mode: "enable",
			previewCookie: JSON.stringify([{ preview: toolbarPreviewRef }]),
		})

		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: true,
			previewRef: null,
		})
	})

	test("returns null when the preview cookie has multiple repository previews", async ({
		request,
	}) => {
		await setupPreviewRef(request, {
			mode: "enable",
			previewCookie: JSON.stringify({
				"example.prismic.io": { preview: toolbarPreviewRef },
				"other.prismic.io": { preview: "other-preview-ref" },
			}),
		})

		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: true,
			previewRef: null,
		})
	})

	test("returns null when Draft Mode is disabled with a preview cookie", async ({ request }) => {
		await setupPreviewRef(request, { mode: "disable", previewCookie: "opaque-preview-ref" })

		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: false,
			previewRef: null,
		})
	})

	test("returns null when Draft Mode is enabled without a preview cookie", async ({ request }) => {
		await setupPreviewRef(request, { mode: "enable" })

		await expect(getPreviewRef(request)).resolves.toEqual({
			draftModeEnabled: true,
			previewRef: null,
		})
	})
})
