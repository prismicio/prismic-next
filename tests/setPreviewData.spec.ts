import type { Page } from "@playwright/test"

import { expect, test } from "./infra"

const toolbarPreviewRef = "m-master-ref:p-overlay-ref"
const toolbarCookie = JSON.stringify({
	_tracker: "https://example.prismic.io",
	"example.prismic.io": { preview: toolbarPreviewRef },
})

async function setupPreviewData(
	page: Page,
	config: { token?: string; previewCookie?: string },
): Promise<void> {
	const searchParams = new URLSearchParams()
	if (config.token !== undefined) {
		searchParams.set("token", config.token)
	}
	if (config.previewCookie !== undefined) {
		searchParams.set("previewCookie", config.previewCookie)
	}

	const response = await page.request.get(`/api/set-preview-data-test?${searchParams}`)
	expect(response.ok()).toBe(true)
}

async function readPreviewRef(page: Page): Promise<unknown> {
	await page.goto("/set-preview-data-test")
	const text = await page.getByTestId("preview-ref").textContent()
	return JSON.parse(text ?? "null")
}

test.describe("setPreviewData", () => {
	test("stores a token query value as-is", async ({ page }) => {
		await setupPreviewData(page, { token: "opaque-preview-token" })

		await expect(readPreviewRef(page)).resolves.toBe("opaque-preview-token")
	})

	test("does not unwrap a token query that looks like a toolbar jar", async ({ page }) => {
		await setupPreviewData(page, { token: toolbarCookie })

		await expect(readPreviewRef(page)).resolves.toBe(toolbarCookie)
	})

	test("unwraps a toolbar JSON preview cookie", async ({ page }) => {
		await setupPreviewData(page, { previewCookie: toolbarCookie })

		await expect(readPreviewRef(page)).resolves.toBe(toolbarPreviewRef)
	})

	test("stores a raw cookie token", async ({ page }) => {
		await setupPreviewData(page, { previewCookie: "opaque-preview-ref" })

		await expect(readPreviewRef(page)).resolves.toBe("opaque-preview-ref")
	})

	test("prefers the token query over a preview cookie", async ({ page }) => {
		await setupPreviewData(page, {
			token: "query-token",
			previewCookie: toolbarCookie,
		})

		await expect(readPreviewRef(page)).resolves.toBe("query-token")
	})

	test("stores nothing when the preview cookie is JSON without a preview field", async ({
		page,
	}) => {
		await setupPreviewData(page, {
			previewCookie: JSON.stringify({ "example.prismic.io": {} }),
		})

		await expect(readPreviewRef(page)).resolves.toBeNull()
	})
})
