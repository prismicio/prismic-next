import { test, expect } from "./test";

test("adds the Prismic toolbar script", async ({
	appRouterPage,
	document,
	repository,
}) => {
	await appRouterPage.goToDocument(document);
	await expect(appRouterPage.toolbarScript).toHaveCount(1);
	const repo = await appRouterPage.getToolbarScriptParam("repo");
	expect(repo).toBe(repository.name);
});

test("supports previews on published documents", async ({
	appRouterPage,
	document,
}) => {
	await appRouterPage.goToDocument(document);
	await expect(appRouterPage.payload).not.toContainText("foo");
	const updatedDocument = await appRouterPage.createNewDraft(document, "foo");
	await appRouterPage.preview(updatedDocument);
	await expect(appRouterPage.payload).toContainText("foo");
});

test("supports previews on unpublished documents", async ({
	appRouterPage,
	unpublishedDocument,
}) => {
	const updatedDocument = await appRouterPage.createNewDraft(
		unpublishedDocument,
		"foo",
	);
	await appRouterPage.preview(updatedDocument);
	await expect(appRouterPage.payload).toContainText("foo");
});

test("updates previews", async ({ appRouterPage, document }) => {
	const updatedDocument = await appRouterPage.createNewDraft(document, "foo");
	await appRouterPage.preview(updatedDocument);
	await expect(appRouterPage.payload).toContainText("foo");
	await appRouterPage.createNewDraft(updatedDocument, "bar");
	await expect(appRouterPage.payload).toContainText("bar");
});

test("restores published document on exit", async ({
	appRouterPage,
	document,
}) => {
	const updatedDocument = await appRouterPage.createNewDraft(document, "foo");
	await appRouterPage.preview(updatedDocument);
	await appRouterPage.exitPreview();
	await expect(appRouterPage.payload).not.toContainText("foo");
});

// We can't get a real shareable link because we aren't authenticated with a
// SESSION cookie. Instead, we can simulate what the link does by setting
// an `io.prismic.previewSession` cookie.
test("supports sharable links", async ({ appRouterPage, document }) => {
	const updatedDocument = await appRouterPage.createNewDraft(document, "foo");
	const previewSession = await appRouterPage.getPreviewSession(updatedDocument);
	await appRouterPage.setPreviewSessionCookie(previewSession.session_id);
	await appRouterPage.goToDocument(document);
	await expect(appRouterPage.payload).toContainText("foo");
});

test("supports custom update endpoint", async ({ appRouterPage, document }) => {
	await appRouterPage.goToDocument(document, "/with-custom-preview-endpoints");
	await expect(appRouterPage.payload).not.toContainText("foo");
	const updatedDocument = await appRouterPage.createNewDraft(document, "foo");
	await appRouterPage.preview(updatedDocument);
	await expect(appRouterPage.payload).toContainText("foo");
});

test("supports custom exit endpoint", async ({ appRouterPage, document }) => {
	const updatedDocument = await appRouterPage.createNewDraft(document, "foo");
	await appRouterPage.preview(updatedDocument);
	await appRouterPage.goToDocument(
		updatedDocument,
		"/with-custom-preview-endpoints",
	);
	await appRouterPage.exitPreview();
	await expect(appRouterPage.payload).not.toContainText("foo");
});
