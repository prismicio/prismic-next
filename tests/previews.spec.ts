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
	const updatedDocument = await repo.createDocumentDraft(pageDoc, content({ payload: "foo" }))
	await appPage.preview(updatedDocument)

	if (testInfo.project.name === "app-router") {
		expect((await page.context().cookies()).find((c) => c.name === cookie.preview)).toMatchObject({
			name: cookie.preview,
			path: "/",
			sameSite: "None",
			secure: true,
			httpOnly: false,
		})
	} else {
		// Pages Router does not write `io.prismic.preview`. Plant the iframe-safe
		// shape so `exitPreview` must expire it (toolbar leftover → start()).
		await page.context().addCookies([
			{
				name: cookie.preview,
				value: "planted",
				domain: "localhost",
				path: "/",
				sameSite: "None",
				secure: true,
				httpOnly: false,
			},
		])
	}

	// Exit via the endpoint directly so the assertion does not depend on the
	// Prismic toolbar loading. The expired overwrite must clear this
	// SameSite=None; Secure cookie, not leave it behind.
	await page.goto("/api/exit-preview")
	expect((await page.context().cookies()).find((c) => c.name === cookie.preview)).toBeUndefined()
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
