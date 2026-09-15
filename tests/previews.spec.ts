import { cookie } from "@prismicio/client"

import { test, expect } from "./infra"
import { content } from "./infra/content/page"

test.describe.configure({ mode: "serial" })

test("adds the Prismic toolbar script", async ({ appPage, pageDoc, repo }) => {
	await appPage.goToDocument(pageDoc)
	await expect(appPage.toolbarScript).toHaveCount(1)
	const param = await appPage.getToolbarScriptParam("repo")
	expect(param).toBe(repo.domain)
})

test("supports previews on published documents", async ({ appPage, repo, pageDoc }) => {
	await appPage.goToDocument(pageDoc)
	await expect(appPage.payload).not.toContainText("foo")
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await appPage.preview(updatedDocument)
	await expect(appPage.payload).toContainText("foo")
})

test("supports previews on unpublished documents", async ({
	appPage,
	repo,
	unpublishedPageDoc,
}) => {
	const updatedDocument = await repo.createDocumentDraft(
		unpublishedPageDoc,
		content({ payload: "foo" }),
	)
	await appPage.preview(updatedDocument)
	await expect(appPage.payload).toContainText("foo")
})

test("updates previews", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await appPage.preview(updatedDocument)
	await expect(appPage.payload).toContainText("foo")
	await repo.createDocumentDraft(updatedDocument, content({ payload: "bar" }))
	await expect(appPage.payload).toContainText("bar")
})

test("restores published pageDoc on exit", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await appPage.preview(updatedDocument)
	await appPage.exitPreview()
	await expect(appPage.payload).not.toContainText("foo")
})

test("clears the preview cookie on exit", async ({ appPage, page, repo, pageDoc }, testInfo) => {
	// `exitPreview` clears the Prismic preview cookie. The Pages Router stores
	// preview state in Next.js preview data instead, so this is App Router only.
	test.skip(testInfo.project.name !== "app-router", "App Router only")

	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await appPage.preview(updatedDocument)
	expect((await page.context().cookies()).map((c) => c.name)).toContain(cookie.preview)

	// Exit via the endpoint directly so the assertion does not depend on the
	// Prismic toolbar loading.
	await page.goto("/api/exit-preview")
	expect((await page.context().cookies()).map((c) => c.name)).not.toContain(cookie.preview)
})

// We can't get a real shareable link because we aren't authenticated with a
// SESSION cookie. Instead, we can simulate what the link does by starting a new
// preview session and directly navigating to the document. The app's preview
// resolver URL is bypassed.
test("supports sharable links", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await repo.createPreviewSession(updatedDocument)
	await appPage.goToDocument(pageDoc)
	await expect(appPage.payload).toContainText("foo")
})

test("supports custom update endpoint", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await repo.createPreviewSession(updatedDocument)
	await appPage.goToDocument(updatedDocument, "/with-custom-preview-endpoints")
	await expect(appPage.payload).toContainText("foo", { timeout: 30000 })
	await repo.createDocumentDraft(updatedDocument, content({ payload: "bar" }))
	await expect(appPage.payload).toContainText("bar")
})

test("supports custom exit endpoint", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await repo.createPreviewSession(updatedDocument)
	await appPage.goToDocument(updatedDocument, "/with-custom-preview-endpoints")
	await expect(appPage.payload).toContainText("foo", { timeout: 30000 })
	await appPage.exitPreview()
	await expect(appPage.payload).not.toContainText("foo")
})

test("previews and exits inside a cross-site iframe", async ({
	page,
	repo,
	pageDoc,
	masterRef,
	baseURL,
}, testInfo) => {
	test.skip(testInfo.project.name !== "app-router", "App Router only")

	const parentURL = new URL("/iframe", baseURL)
	parentURL.hostname = "127.0.0.1"
	// Chromium treats `page.route` responses as public, so the frame needs this to reach loopback.
	await page.context().grantPermissions(["local-network-access"], { origin: parentURL.origin })

	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	const previewSession = await repo.createPreviewSession(updatedDocument)
	await page.route(parentURL.href, (route) =>
		route.fulfill({
			contentType: "text/html",
			body: `<iframe src="${previewSession.preview_url}">`,
		}),
	)
	await page.goto(parentURL.href)
	const frame = page.frameLocator("iframe")
	await expect(frame.getByTestId("payload")).toContainText("foo")

	// A ref update refreshes in place, so the marker survives.
	await frame.locator("html").evaluate(
		(html, [name, ref]) => {
			html.dataset.marker = ""
			document.cookie = `${name}=${ref}; SameSite=None; Secure`
			window.dispatchEvent(new Event("prismicPreviewUpdate"))
		},
		[cookie.preview, masterRef],
	)
	await expect(frame.getByTestId("payload")).toHaveText("published")
	await expect(frame.locator("html")).toHaveAttribute("data-marker", "")

	await frame.locator("body").evaluate(() => fetch("/api/exit-preview"))
	await frame.locator("body").evaluate(() => location.reload())
	await expect(frame.getByTestId("payload")).toHaveText("published")
})

test("reads any preview ref but ignores the toolbar's inactive cookie", async ({
	page,
	pageDoc,
	masterRef,
}, testInfo) => {
	test.skip(testInfo.project.name !== "app-router", "App Router only")

	// The master ref stands in for a ref in any format.
	await page.goto(`/api/preview?token=${masterRef}&documentId=${pageDoc.id}`)
	const previewRef = page.getByTestId("preview-ref")
	await expect(previewRef).toHaveText(masterRef)

	// Draft Mode stays on, as when a site also uses it for something other than Prismic.
	const trackerOnly = encodeURIComponent('{"_tracker":"abc123"}')
	await page
		.context()
		.addCookies([{ name: cookie.preview, value: trackerOnly, domain: "localhost", path: "/" }])
	await page.reload()
	await expect(previewRef).toBeEmpty()
})
