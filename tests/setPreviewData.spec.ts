import type { APIRequestContext } from "@playwright/test"

import { expect, test } from "./infra"

const toolbarPreviewRef = "m-master-ref:p-overlay-ref"
const toolbarCookie = JSON.stringify({
	_tracker: "https://example.prismic.io",
	"example.prismic.io": { preview: toolbarPreviewRef },
})

async function setupPreviewData(
	request: APIRequestContext,
	config: { token?: string; previewCookie?: string },
): Promise<void> {
	const searchParams = new URLSearchParams()
	if (config.token !== undefined) {
		searchParams.set("token", config.token)
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
	test("stores a token query value as-is", async ({ request }) => {
		await setupPreviewData(request, { token: "opaque-preview-token" })

		await expect(readPreviewRef(request)).resolves.toBe("opaque-preview-token")
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
			token: "query-token",
			previewCookie: toolbarCookie,
		})

		await expect(readPreviewRef(request)).resolves.toBe("query-token")
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
