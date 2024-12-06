import { test, expect } from "./test";

test("adds the Prismic toolbar script", async ({ appRouterPage }) => {
	await appRouterPage.goto("/PrismicPreview/default");
	await expect(appRouterPage.toolbarScript).toHaveCount(1);
	const repo = await appRouterPage.getToolbarScriptParam("repo");
	expect(repo).toBe("foobar");
});

test("preview endpoint enters draft mode", async ({ appRouterPage }) => {
	await appRouterPage.goto("/api/preview");
});

// test("refreshes the page on prismicPreviewUpdate events", async ({
// 	appRouterPage,
// }) => {
// 	await appRouterPage.goto("/PrismicPreview/default");
// 	await appRouterPage.dispatchPreviewUpdateEvent();
// 	await appRouterPage.waitForTimestampChange();
// });
//
// test("calls the default exit preview endpoint on prismicPreviewEnd events", async ({
// 	appRouterPage,
// }) => {
// 	await appRouterPage.goto("/PrismicPreview/default");
// 	const request = appRouterPage.waitForRequest("/api/exit-preview");
// 	await appRouterPage.dispatchPreviewEndEvent();
// 	await request;
// 	await appRouterPage.waitForTimestampChange();
// });
//
// test("calls the custom exit preview endpoint on prismicPreviewEnd events", async ({
// 	appRouterPage,
// }) => {
// 	await appRouterPage.goto("/PrismicPreview/with-custom-exit-url");
// 	const request = appRouterPage.waitForRequest("/api/custom-exit-preview");
// 	await appRouterPage.dispatchPreviewEndEvent();
// 	await request;
// 	await appRouterPage.waitForTimestampChange();
// });
//
// test("calls the preview endpoint when accessing from a preview share link", async ({
// 	appRouterPage,
// }) => {
// 	await appRouterPage.goto("/PrismicPreview/default");
// 	await appRouterPage.dispatchPreviewUpdateEvent();
// 	await appRouterPage.waitForTimestampChange();
// });
