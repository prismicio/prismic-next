import { test, expect } from "./test";
import { content } from "./data/page";

test("adds the Prismic toolbar script", async ({
	appPage,
	pageDocument,
	repository,
}) => {
	await appPage.goToDocument(pageDocument);
	await expect(appPage.toolbarScript).toHaveCount(1);
	const repo = await appPage.getToolbarScriptParam("repo");
	expect(repo).toBe(repository.name);
});

test("supports previews on published documents", async ({
	appPage,
	pageDocument,
}) => {
	await appPage.goToDocument(pageDocument);
	await expect(appPage.payload).not.toContainText("foo");
	const updatedDocument = await appPage.createNewDraft(pageDocument, (uid) =>
		content(uid, { payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports previews on unpublished documents", async ({
	appPage,
	unpublishedPageDocument,
}) => {
	const updatedDocument = await appPage.createNewDraft(
		unpublishedPageDocument,
		(uid) => content(uid, { payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("updates previews", async ({ appPage, pageDocument }) => {
	const updatedDocument = await appPage.createNewDraft(pageDocument, (uid) =>
		content(uid, { payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
	await appPage.createNewDraft(updatedDocument, (uid) =>
		content(uid, { payload: "bar" }),
	);
	await expect(appPage.payload).toContainText("bar");
});

test("restores published pageDocument on exit", async ({
	appPage,
	pageDocument,
}) => {
	const updatedDocument = await appPage.createNewDraft(pageDocument, (uid) =>
		content(uid, { payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await appPage.exitPreview();
	await expect(appPage.payload).not.toContainText("foo");
});

// We can't get a real shareable link because we aren't authenticated with a
// SESSION cookie. Instead, we can simulate what the link does by setting
// an `io.prismic.previewSession` cookie.
test("supports sharable links", async ({ appPage, pageDocument }) => {
	const updatedDocument = await appPage.createNewDraft(pageDocument, (uid) =>
		content(uid, { payload: "foo" }),
	);
	const previewSession = await appPage.getPreviewSession(updatedDocument);
	await appPage.setPreviewSessionCookie(previewSession.session_id);
	await appPage.goToDocument(pageDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports custom update endpoint", async ({ appPage, pageDocument }) => {
	await appPage.goToDocument(pageDocument, "/with-custom-preview-endpoints");
	await expect(appPage.payload).not.toContainText("foo");
	const updatedDocument = await appPage.createNewDraft(pageDocument, (uid) =>
		content(uid, { payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports custom exit endpoint", async ({ appPage, pageDocument }) => {
	const updatedDocument = await appPage.createNewDraft(pageDocument, (uid) =>
		content(uid, { payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await appPage.goToDocument(updatedDocument, "/with-custom-preview-endpoints");
	await appPage.exitPreview();
	await expect(appPage.payload).not.toContainText("foo");
});
