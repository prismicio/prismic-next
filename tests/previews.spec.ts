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
	// Older versions and the toolbar write the cookie with `SameSite=Lax`.
	await page
		.context()
		.addCookies([{ name: cookie.preview, value: "leftover", domain: "localhost", path: "/" }])

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

test("supports sharable links to unpublished documents", async ({
	page,
	repo,
	unpublishedPageDoc,
}, testInfo) => {
	test.skip(testInfo.project.name !== "app-router", "App Router only")

	const updatedDocument = await repo.createDocumentDraft(
		unpublishedPageDoc,
		content({ payload: "foo" }),
	)
	const previewSession = await repo.createPreviewSession(updatedDocument)
	const ref = new URL(previewSession.preview_url).searchParams.get("token")!
	await page
		.context()
		.addCookies([{ name: cookie.preview, value: ref, domain: "localhost", path: "/" }])
	await page.goto("/unpublished")
	await expect(page.getByTestId("payload")).toContainText("foo")
})

test("restarts a preview that ended in another tab", async ({ embed, repo, pageDoc }, testInfo) => {
	test.skip(testInfo.project.name !== "app-router", "App Router only")

	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	const previewSession = await repo.createPreviewSession(updatedDocument)
	const frame = await embed(previewSession.preview_url)
	await expect(frame.getByTestId("payload")).toContainText("foo")

	// Another tab exits, then the editor pushes a new ref to this frame.
	await frame.locator("body").evaluate(() => fetch("/api/exit-preview"))
	const nextDraft = await repo.createDocumentDraft(updatedDocument, content({ payload: "bar" }))
	const nextSession = await repo.createPreviewSession(nextDraft)
	await frame.locator("html").evaluate(
		(html, [name, ref]) => {
			html.dataset.marker = ""
			document.cookie = `${name}=${ref}; SameSite=None; Secure`
			window.dispatchEvent(
				new CustomEvent("prismicPreviewUpdate", { detail: { ref }, cancelable: true }),
			)
		},
		[cookie.preview, new URL(nextSession.preview_url).searchParams.get("token")!],
	)
	await expect(frame.getByTestId("payload")).toContainText("bar")
	await expect(frame.locator("html")).toHaveAttribute("data-marker", "")
})

test("starts a preview in place on a published page", async ({
	appPage,
	page,
	repo,
	pageDoc,
}, testInfo) => {
	test.skip(testInfo.project.name !== "app-router", "App Router only")

	await appPage.goToDocument(pageDoc)
	await expect(appPage.payload).toHaveText("published")
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	const previewSession = await repo.createPreviewSession(updatedDocument)
	const ref = new URL(previewSession.preview_url).searchParams.get("token")!

	// The toolbar writes the cookie, then reloads unless the page handles the event.
	const handled = await page.evaluate(
		([name, ref]) => {
			document.documentElement.dataset.marker = ""
			document.cookie = `${name}=${ref}`
			return !window.dispatchEvent(
				new CustomEvent("prismicPreviewStart", { detail: { ref }, cancelable: true }),
			)
		},
		[cookie.preview, ref],
	)
	expect(handled).toBe(true)
	await expect(appPage.payload).toContainText("foo")
	await expect(page.locator("html")).toHaveAttribute("data-marker", "")
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
	embed,
	repo,
	pageDoc,
	masterRef,
}, testInfo) => {
	test.skip(testInfo.project.name !== "app-router", "App Router only")

	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	const previewSession = await repo.createPreviewSession(updatedDocument)
	const frame = await embed(previewSession.preview_url)
	await expect(frame.getByTestId("payload")).toContainText("foo")

	// A ref update refreshes in place, so the marker survives.
	await frame.locator("html").evaluate(
		(html, [name, ref]) => {
			html.dataset.marker = ""
			document.cookie = `${name}=${ref}; SameSite=None; Secure`
			window.dispatchEvent(
				new CustomEvent("prismicPreviewUpdate", { detail: { ref }, cancelable: true }),
			)
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
