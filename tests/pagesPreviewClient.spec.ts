import { test, expect } from "./infra"

test("coalesces updates during a pending Pages preview request to the latest ref", async ({
	page,
}) => {
	const toolbarReady = page.waitForRequest("**/prismic.js*")
	await page.route("**/prismic.js*", (route) => route.abort())
	await page.goto("/preview-client-test")
	await toolbarReady
	await expect(page.getByTestId("preview-ref")).toHaveText("none")
	let releaseFirst!: () => void
	const firstPending = new Promise<void>((resolve) => {
		releaseFirst = resolve
	})
	let requests = 0
	await page.route("**/api/set-preview-data-test?redirect", async (route) => {
		requests++
		if (requests === 1) await firstPending
		await route.continue()
	})
	await page.evaluate(() => {
		document.documentElement.dataset.previewIdentity = "preserved"
		document.cookie = "io.prismic.preview=opaque-A; Path=/; SameSite=None; Secure"
		window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
	})
	await expect.poll(() => requests).toBe(1)
	await page.evaluate(() => {
		for (const ref of ["opaque-B", "opaque-C"]) {
			document.cookie = `io.prismic.preview=${ref}; Path=/; SameSite=None; Secure`
			window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
		}
	})
	releaseFirst()
	await expect(page.getByTestId("preview-ref")).toHaveText("opaque-C")
	expect(requests).toBe(2)
	await expect(page.locator("html")).toHaveAttribute("data-preview-identity", "preserved")
})

test("cancels a pending Pages preview request when the preview ends", async ({ page }) => {
	const toolbarReady = page.waitForRequest("**/prismic.js*")
	await page.route("**/prismic.js*", (route) => route.abort())
	await page.goto("/preview-client-test")
	await toolbarReady
	await expect(page.getByTestId("preview-ref")).toHaveText("none")
	let release!: () => void
	const pending = new Promise<void>((resolve) => {
		release = resolve
	})
	await page.route("**/api/set-preview-data-test?redirect", async (route) => {
		await pending
		await route.continue()
	})
	const started = page.waitForRequest("**/api/set-preview-data-test?redirect")
	await page.evaluate(() => {
		document.cookie = "io.prismic.preview=opaque-ref; Path=/; SameSite=None; Secure"
		window.dispatchEvent(new Event("prismicPreviewUpdate", { cancelable: true }))
	})
	const previewRequest = await started
	const aborted = page.waitForEvent("requestfailed", (request) => request === previewRequest)
	const exited = page.waitForResponse("**/api/exit-preview")
	await page.evaluate(() => {
		window.dispatchEvent(new Event("prismicPreviewEnd", { cancelable: true }))
	})
	await exited
	release()
	await aborted
	await expect(page.getByTestId("preview-ref")).toHaveText("none")
	expect((await page.context().cookies()).map((cookie) => cookie.name)).not.toContain(
		"__prerender_bypass",
	)
})
