/* eslint react-hooks/rules-of-hooks: 0 */
import { Locator, Page, test as base, expect } from "@playwright/test";
import { createClient } from "@prismicio/client";
import assert from "assert";

import { CoreAPIDocument, Prismic, Repo } from "./client";

export { expect } from "@playwright/test";

type Fixtures = {
	prismic: Prismic;
	repo: Repo;
	linkDoc: CoreAPIDocument;
	imageDoc: CoreAPIDocument;
	pageDoc: CoreAPIDocument;
	unpublishedPageDoc: CoreAPIDocument;
	appPage: AppPage;
};

export const test = base.extend<Fixtures>({
	prismic: async ({ page }, use) => {
		const prismic = new Prismic({
			baseURL: "https://prismic.io",
			auth: {
				email: process.env.PLAYWRIGHT_PRISMIC_USERNAME,
				password: process.env.PLAYWRIGHT_PRISMIC_PASSWORD,
			},
			request: page.request,
		});
		await use(prismic);
	},
	repo: async ({ page, prismic, baseURL }, use) => {
		assert(baseURL, "A baseURL must be configured to test Prismic previews.");
		const cookies = await page.context().cookies();
		const repositoryName = cookies.find(
			(cookie) => cookie.name === "repository-name",
		)?.value;
		assert(
			repositoryName,
			"There is no repository-name cookie. The setup project must run first.",
		);
		const repository = prismic.getRepo(repositoryName);
		const previewConfigs = await repository.getPreviewConfigs();
		const previewConfig = previewConfigs.find(
			(config) => new URL(config.url).origin === baseURL,
		);
		if (!previewConfig) {
			const url = new URL("api/preview", baseURL);
			await repository.createPreview({ name: url.toString(), url });
		}
		await use(repository);
	},
	pageDoc: async ({ repo: repository }, use) => {
		const document = await repository.getDocumentByUID("page", "published");
		await use(document);
	},
	unpublishedPageDoc: async ({ repo: repository }, use) => {
		const document = await repository.getDocumentByUID("page", "unpublished");
		await use(document);
	},
	appPage: async ({ page, repo: repository }, use) => {
		const appPage = new AppPage(page, repository);
		await use(appPage);
	},
});

class AppPage {
	page: Page;
	repository: Repo;

	// Locators
	toolbarScript: Locator;
	toolbar: Locator;
	payload: Locator;

	constructor(page: Page, repository: Repo) {
		this.page = page;
		this.repository = repository;

		// Locators
		this.toolbarScript = page.locator('script[src*="prismic.io/prismic.js"]');
		this.toolbar = page.locator("#prismic-toolbar-v2 .PreviewMenu");
		this.payload = page.getByTestId("payload");
	}

	async goToDocument(document: CoreAPIDocument, pathPrefix = "") {
		const client = createClient(
			new URL("/api/v2", this.repository.urls.cdn).toString(),
			{
				routes: [
					{ type: "page", path: "/:uid" },
					{ type: "link_test", path: "/PrismicNextLink/:uid" },
					{ type: "image_test", path: "/PrismicNextImage/:uid" },
				],
			},
		);
		const apiDocument = await client.getByID(document.id);
		return await this.page.goto(pathPrefix + apiDocument.url!);
	}

	async preview(document: CoreAPIDocument) {
		const previewSession = await this.repository.createPreviewSession(document);
		await this.page.goto(previewSession.preview_url);
	}

	async exitPreview() {
		const closeButton = this.toolbar.locator("img.Icon.x");
		await closeButton.click();
		await expect(this.toolbar).toHaveCount(0);
	}

	async getToolbarScriptParam(name: string) {
		const src = await this.toolbarScript.getAttribute("src");
		return new URL(src ?? "").searchParams.get(name);
	}
}
