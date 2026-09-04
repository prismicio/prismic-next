import type { Page } from "@playwright/test"

import { test, expect } from "./infra"

async function openPreviewPage(page: Page, url: string): Promise<void> {
	// The real toolbar is lazy-loaded after the SDK's listeners mount.
	const toolbarReady = page.waitForRequest("**/prismic.js*")
	await page.route("**/prismic.js*", (route) => route.abort())
	await page.goto(url)
	await toolbarReady
}

test("recovers an unpublished page when preview starts from a not-found screen", async ({
	page,
}) => {
	await openPreviewPage(page, "/preview-recovery-test")
	await expect(page.getByRole("heading", { name: "Document not found" })).toBeVisible()
	const activated = page.waitForRequest("**/prismic.js*")
	await page.evaluate(() => {
		document.cookie = "io.prismic.preview=opaque-unpublished-ref; Path=/; SameSite=None; Secure"
		window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
	})
	await activated
	await expect(page.getByTestId("preview-ref")).toHaveText("opaque-unpublished-ref")
	await page.evaluate(() => {
		document.documentElement.dataset.previewIdentity = "preserved"
		document.cookie = "io.prismic.preview=opaque-recovered-update; Path=/; SameSite=None; Secure"
		window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
	})
	await expect(page.getByTestId("preview-ref")).toHaveText("opaque-recovered-update")
	await expect(page.locator("html")).toHaveAttribute("data-preview-identity", "preserved")
})

test("keeps Draft Mode and live refs inside a cross-site HTTP localhost iframe", async ({
	page,
}) => {
	await page.context().grantPermissions(["local-network-access"], {
		origin: "http://127.0.0.1:4321",
	})
	await page.route("http://127.0.0.1:4321/iframe-test", (route) =>
		route.fulfill({
			contentType: "text/html",
			body: '<iframe src="http://localhost:4321/api/get-preview-ref-test?mode=bootstrap&client&token=opaque-initial-ref"></iframe>',
		}),
	)
	await openPreviewPage(page, "http://127.0.0.1:4321/iframe-test")
	const frame = page.frameLocator("iframe")
	await expect(frame.getByTestId("draft-mode")).toHaveText("true")
	await expect(frame.getByTestId("preview-ref")).toHaveText("opaque-initial-ref")
	await frame.locator("html").evaluate((element) => {
		element.dataset.previewIdentity = "preserved"
		document.cookie = "io.prismic.preview=opaque-iframe-update; Path=/; SameSite=None; Secure"
		window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
	})
	await expect(frame.getByTestId("preview-ref")).toHaveText("opaque-iframe-update")
	await expect(frame.locator("html")).toHaveAttribute("data-preview-identity", "preserved")
})

test("bootstraps opaque pushed refs once, then refreshes in place", async ({ page }) => {
	await openPreviewPage(page, "/preview-client-test")
	await expect(page.getByTestId("draft-mode")).toHaveText("false")
	await expect(page.getByTestId("preview-ref")).toHaveText("none")

	await page.evaluate(() => {
		document.cookie = "io.prismic.preview=opaque-first-ref; Path=/; SameSite=None; Secure"
	})
	expect(await page.context().cookies()).toEqual(
		expect.arrayContaining([
			expect.objectContaining({ name: "io.prismic.preview", value: "opaque-first-ref" }),
		]),
	)

	let bootstrapRequests = 0
	let finishBootstrap!: () => void
	const bootstrapPending = new Promise<void>((resolve) => {
		finishBootstrap = resolve
	})
	await page.route("**/api/get-preview-ref-test?mode=bootstrap", async (route) => {
		bootstrapRequests++
		await bootstrapPending
		await route.continue()
	})

	await page.evaluate(() => {
		for (let i = 0; i < 3; i++) {
			window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
		}
	})
	await expect.poll(() => bootstrapRequests).toBe(1)
	const activated = page.waitForRequest("**/prismic.js*")
	finishBootstrap()
	await activated
	await expect(page.getByTestId("draft-mode")).toHaveText("true")
	await expect(page.getByTestId("preview-ref")).toHaveText("opaque-first-ref")

	await page.evaluate(() => {
		document.documentElement.dataset.previewIdentity = "preserved"
		document.cookie = "io.prismic.preview=opaque-updated-ref; Path=/; SameSite=None; Secure"
	})
	await page.evaluate(() => {
		window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
	})
	await expect(page.getByTestId("preview-ref")).toHaveText("opaque-updated-ref")
	expect(bootstrapRequests).toBe(1)
	await expect(page.locator("html")).toHaveAttribute("data-preview-identity", "preserved")
})

test("cancels a pending bootstrap when the preview ends", async ({ page }) => {
	await openPreviewPage(page, "/preview-client-test")
	await expect(page.getByTestId("draft-mode")).toHaveText("false")

	let finishBootstrap!: () => void
	const bootstrapPending = new Promise<void>((resolve) => {
		finishBootstrap = resolve
	})
	await page.route("**/api/get-preview-ref-test?mode=bootstrap", async (route) => {
		await bootstrapPending
		await route.continue()
	})
	const started = page.waitForRequest("**/api/get-preview-ref-test?mode=bootstrap")
	await page.evaluate(() => {
		document.cookie = "io.prismic.preview=opaque-ref; Path=/; SameSite=None; Secure"
		window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
	})
	const bootstrapRequest = await started
	const aborted = page.waitForEvent("requestfailed", (request) => request === bootstrapRequest)
	const exited = page.waitForResponse("**/api/exit-preview")
	await page.evaluate(() => {
		window.dispatchEvent(new Event("prismicPreviewEnd", { cancelable: true }))
	})
	await exited
	finishBootstrap()
	await aborted
	await expect(page.getByTestId("draft-mode")).toHaveText("false")
	await expect(page.getByTestId("preview-ref")).toHaveText("none")
	expect((await page.context().cookies()).map((cookie) => cookie.name)).not.toContain(
		"__prerender_bypass",
	)
})
