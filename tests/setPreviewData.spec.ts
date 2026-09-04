import type { APIRequestContext } from "@playwright/test"

import { expect, test } from "./infra"

const toolbarPreviewRef = "m-master-ref:p-overlay-ref"
const toolbarCookie = JSON.stringify({
	_tracker: "https://example.prismic.io",
	"example.prismic.io": { preview: toolbarPreviewRef },
})

async function setupPreviewData(
	request: APIRequestContext,
	config: { token?: string | string[]; previewCookie?: string },
): Promise<void> {
	const searchParams = new URLSearchParams()
	if (config.token !== undefined) {
		const tokens = Array.isArray(config.token) ? config.token : [config.token]
		for (const token of tokens) {
			searchParams.append("token", token)
		}
	}
	if (config.previewCookie !== undefined) {
		searchParams.set("previewCookie", config.previewCookie)
	}

	const response = await request.get(`/api/set-preview-data-test?${searchParams}`)
	expect(response.ok()).toBe(true)
}

async function readPreviewRef(request: APIRequestContext): Promise<unknown> {
	const response = await request.get("/set-preview-data-test", {
		headers: { Accept: "application/json" },
	})
	expect(response.ok()).toBe(true)
	return (await response.json()).previewRef
}

test.describe("setPreviewData", () => {
	test("keeps Preview Mode cookies available to cross-site iframe requests in development", async ({
		request,
	}) => {
		const response = await request.get("/api/set-preview-data-test?token=opaque-preview-ref")
		expect(response.ok()).toBe(true)
		const setCookies = response
			.headersArray()
			.filter((header) => header.name.toLowerCase() === "set-cookie")
		expect(setCookies.map((header) => header.value)).toContain(
			"unrelated=value; Path=/; HttpOnly; SameSite=Lax",
		)
		for (const name of ["__prerender_bypass", "__next_preview_data"]) {
			const cookie = setCookies.find((header) => header.value.startsWith(`${name}=`))?.value
			expect(cookie).toMatch(/; SameSite=None/i)
			expect(cookie).toMatch(/; Secure/i)
			expect(cookie).toMatch(/; HttpOnly/i)
		}
		await expect(readPreviewRef(request)).resolves.toBe("opaque-preview-ref")
	})

	test("exits Preview Mode and removes both Next preview cookies", async ({ request }) => {
		await setupPreviewData(request, { token: "opaque-preview-ref" })
		const response = await request.get("/api/exit-preview")
		expect(response.ok()).toBe(true)
		const cookieNames = (await request.storageState()).cookies.map((cookie) => cookie.name)
		expect(cookieNames).not.toContain("__prerender_bypass")
		expect(cookieNames).not.toContain("__next_preview_data")
		expect(cookieNames).toContain("unrelated")
		await expect(readPreviewRef(request)).resolves.toBeNull()
	})

	test("stores a token query value as-is", async ({ request }) => {
		await setupPreviewData(request, { token: "opaque-preview-ref" })

		await expect(readPreviewRef(request)).resolves.toBe("opaque-preview-ref")
	})

	test("does not unwrap a token query that looks like a toolbar jar", async ({ request }) => {
		await setupPreviewData(request, { token: toolbarCookie })

		await expect(readPreviewRef(request)).resolves.toBe(toolbarCookie)
	})

	test("unwraps a toolbar JSON preview cookie", async ({ request }) => {
		await setupPreviewData(request, { previewCookie: toolbarCookie })

		await expect(readPreviewRef(request)).resolves.toBe(toolbarPreviewRef)
	})

	test("stores a raw cookie token", async ({ request }) => {
		await setupPreviewData(request, { previewCookie: "opaque-preview-ref" })

		await expect(readPreviewRef(request)).resolves.toBe("opaque-preview-ref")
	})

	test("prefers the token query over a preview cookie", async ({ request }) => {
		await setupPreviewData(request, {
			token: "query-preview-ref",
			previewCookie: toolbarCookie,
		})

		await expect(readPreviewRef(request)).resolves.toBe("query-preview-ref")
	})

	test("stores repeated token query values as an ordered array", async ({ request }) => {
		const queryValues = ["query-preview-ref-one", "query-preview-ref-two"]

		await setupPreviewData(request, {
			token: queryValues,
			previewCookie: toolbarCookie,
		})

		await expect(readPreviewRef(request)).resolves.toEqual(queryValues)
	})

	test("stores nothing when the preview cookie is JSON without a preview field", async ({
		request,
	}) => {
		await setupPreviewData(request, {
			previewCookie: JSON.stringify({ "example.prismic.io": {} }),
		})

		await expect(readPreviewRef(request)).resolves.toBeNull()
	})
})
