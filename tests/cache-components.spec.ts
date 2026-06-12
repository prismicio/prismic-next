import { test, expect } from "./infra"
import { content } from "./infra/content/page"

test("revalidates cached pages with revalidatePrismicPages", async ({
	appPage,
	page,
	repo,
	pageDoc,
}) => {
	// Prime the cache with the published content.
	await appPage.goToDocument(pageDoc)
	await expect(appPage.payload).toHaveText("published")

	// Publish new content for the document.
	const draft = await repo.createDocumentDraft(pageDoc, content({ payload: "revalidated" }))
	await repo.publishDocument(draft.id)

	// The cached page keeps serving the old content until it is revalidated.
	await appPage.goToDocument(pageDoc)
	await expect(appPage.payload).toHaveText("published")

	// Revalidating the document's cache tag serves the new content. The webhook
	// body mirrors the `api-update` payload Prismic sends on publish. Retried as
	// a unit so each attempt re-fetches in case the change has not yet
	// propagated to Prismic's CDN.
	await expect(async () => {
		await page.request.post("/api/revalidate", {
			data: { type: "api-update", documents: [pageDoc.id] },
		})
		await appPage.goToDocument(pageDoc)
		await expect(appPage.payload).toHaveText("revalidated", { timeout: 1000 })
	}).toPass({ timeout: 30_000 })
})
