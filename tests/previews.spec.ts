import { test, expect } from "./infra";
import { content } from "./infra/content/page";

test.describe.configure({ mode: "serial" });

test("adds the Prismic toolbar script", async ({ appPage, pageDoc, repo }) => {
	await appPage.goToDocument(pageDoc);
	await expect(appPage.toolbarScript).toHaveCount(1);
	const param = await appPage.getToolbarScriptParam("repo");
	expect(param).toBe(repo.domain);
});

test("supports previews on published documents", async ({
	appPage,
	repo,
	pageDoc,
}) => {
	await appPage.goToDocument(pageDoc);
	await expect(appPage.payload).not.toContainText("foo");
	const updatedDocument = await repo.createDocumentDraft(
		pageDoc,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports previews on unpublished documents", async ({
	appPage,
	repo,
	unpublishedPageDoc,
}) => {
	const updatedDocument = await repo.createDocumentDraft(
		unpublishedPageDoc,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("updates previews", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDoc,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
	await expect(appPage.toolbar).toHaveCount(1);
	await repo.createDocumentDraft(updatedDocument, content({ payload: "bar" }));
	await expect(appPage.payload).toContainText("bar");
});

test("restores published pageDoc on exit", async ({
	appPage,
	repo,
	pageDoc,
}) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDoc,
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
test("supports sharable links", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDoc,
		content({ payload: "foo" }),
	);
	await repo.createPreviewSession(updatedDocument);
	await appPage.goToDocument(pageDoc);
	await expect(appPage.payload).toContainText("foo");
});

test("supports custom update endpoint", async ({ appPage, repo, pageDoc }) => {
	await appPage.goToDocument(pageDoc, "/with-custom-preview-endpoints");
	await expect(appPage.payload).not.toContainText("foo");
	const updatedDocument = await repo.createDocumentDraft(
		pageDoc,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await expect(appPage.payload).toContainText("foo");
});

test("supports custom exit endpoint", async ({ appPage, repo, pageDoc }) => {
	const updatedDocument = await repo.createDocumentDraft(
		pageDoc,
		content({ payload: "foo" }),
	);
	await appPage.preview(updatedDocument);
	await appPage.goToDocument(updatedDocument, "/with-custom-preview-endpoints");
	await appPage.exitPreview();
	await expect(appPage.payload).not.toContainText("foo");
});
