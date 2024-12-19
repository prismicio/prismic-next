import { test, expect } from "./test";
import { content } from "./data/page";

test.describe.configure({ mode: "serial" });

test("adds the Prismic toolbar script", async ({
	appPage,
	pageDoc: pageDocument,
	repo,
}) => {
	await appPage.goToDocument(pageDocument);
	await expect(appPage.toolbarScript).toHaveCount(1);
	const param = await appPage.getToolbarScriptParam("repo");
	expect(param).toBe(repo.domain);
});

test("supports previews on published documents", async ({
	appPage,
	repo,
	pageDoc: pageDocument,
}) => {
	await appPage.goToDocument(pageDocument);
	await expect(appPage.payload).not.toContainText("foo");
	const updatedDocument = await repo.createDocumentDraft(
		pageDocument,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports previews on unpublished documents", async ({
	appPage,
	repo,
	unpublishedPageDoc: unpublishedPageDocument,
}) => {
	const updatedDocument = await repo.createDocumentDraft(
		unpublishedPageDocument,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("updates previews", async ({ appPage, repo, pageDoc: pageDocument }) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDocument,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
	await repo.createDocumentDraft(updatedDocument, content({ payload: "bar" }));
	await expect(appPage.payload).toContainText("bar");
});

test("restores published pageDocument on exit", async ({
	appPage,
	repo,
	pageDoc: pageDocument,
}) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDocument,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await appPage.exitPreview();
	await expect(appPage.payload).not.toContainText("foo");
});

// We can't get a real shareable link because we aren't authenticated with a
// SESSION cookie. Instead, we can simulate what the link does by starting a new
// preview session and directly navigating to the document. The app's preview
// resolver URL is bypassed.
test("supports sharable links", async ({
	appPage,
	repo,
	pageDoc: pageDocument,
}) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDocument,
		content({ payload: "foo" }),
	);
	await repo.createPreviewSession(updatedDocument);
	await appPage.goToDocument(pageDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports custom update endpoint", async ({
	appPage,
	repo,
	pageDoc: pageDocument,
}) => {
	await appPage.goToDocument(pageDocument, "/with-custom-preview-endpoints");
	await expect(appPage.payload).not.toContainText("foo");
	const updatedDocument = await repo.createDocumentDraft(
		pageDocument,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports custom exit endpoint", async ({
	appPage,
	repo,
	pageDoc: pageDocument,
}) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDocument,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await appPage.goToDocument(updatedDocument, "/with-custom-preview-endpoints");
	await appPage.exitPreview();
	await expect(appPage.payload).not.toContainText("foo");
});
