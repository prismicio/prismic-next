/* eslint react-hooks/rules-of-hooks: 0 */
import { Locator, Page, test as base, expect } from "@playwright/test";
import {
	RepositoriesManager,
	RepositoryManager,
	createRepositoriesManager,
} from "@prismicio/e2e-tests-utils";
import { Client, createClient } from "@prismicio/client";

import {
	CoreApiDocument,
	Preview,
	createDocumentData,
	createNewDraft,
	getPreviewSession,
} from "./lib";

export { expect } from "@playwright/test";

type Fixtures = {
	appRouterPage: AppRouterPage;
	pagesRouterPage: PagesRouterPage;
	repositoriesManager: RepositoriesManager;
	repository: RepositoryManager;
	document: CoreApiDocument;
	unpublishedDocument: CoreApiDocument;
	previews: Preview[];
	appRouterPreview: Preview;
	pagesRouterPreview: Preview;
};

export const test = base.extend<Fixtures>({
	// eslint-disable-next-line no-empty-pattern
	repositoriesManager: async ({}, use) => {
		const manager = createRepositoriesManager({
			urlConfig: "https://prismic.io",
			authConfig: {
				email: process.env.PLAYWRIGHT_PRISMIC_USERNAME,
				password: process.env.PLAYWRIGHT_PRISMIC_PASSWORD,
			},
		});
		await use(manager);
		await manager.tearDown();
	},
	repository: async ({ repositoriesManager }, use) => {
		const repository =
			repositoriesManager.getRepositoryManager("prismicio-next-dev");
		await use(repository);
	},
	appRouterPage: async ({ page, repositoriesManager, repository }, use) => {
		await use(new AppRouterPage(page, repositoriesManager, repository));
	},
	pagesRouterPage: async ({ page, repositoriesManager, repository }, use) => {
		await use(new PagesRouterPage(page, repositoriesManager, repository));
	},
	document: async ({ repository }, use) => {
		const document = await repository.createDocument(
			{
				custom_type_id: "page",
				title: test.info().title,
				tags: [],
				integration_field_ids: [],
				data: createDocumentData(),
			},
			"published",
		);
		await use(document);
	},
	unpublishedDocument: async ({ repository }, use) => {
		const document = await repository.createDocument(
			{
				custom_type_id: "page",
				title: test.info().title,
				tags: [],
				integration_field_ids: [],
				data: createDocumentData(),
			},
			"draft",
		);
		await use(document);
	},
	previews: async ({ repositoriesManager: manager, repository }, use) => {
		const token = await manager.getUserApiToken();
		const res = await fetch(
			new URL("/core/repository/preview_configs", repository.getBaseURL()),
			{ headers: { authorization: `Bearer ${token}` } },
		);
		const json = await res.json();
		await use(json.results);
	},
	appRouterPreview: async ({ previews, appRouterPage }, use) => {
		const preview = previews.find(
			(preview) => new URL(preview.url).origin === appRouterPage.baseURL,
		);
		if (!preview) throw new Error("Could not find preview");
		await use(preview);
	},
	pagesRouterPreview: async ({ previews, pagesRouterPage }, use) => {
		const preview = previews.find(
			(preview) => new URL(preview.url).origin === pagesRouterPage.baseURL,
		);
		if (!preview) throw new Error("Could not find preview");
		await use(preview);
	},
});

class DefaultPage {
	page: Page;
	baseURL: string;
	repositoriesManager: RepositoriesManager;
	repositoryManager: RepositoryManager;
	client: Client;

	// Locators
	toolbarScript: Locator;
	toolbar: Locator;
	payload: Locator;

	constructor(
		page: Page,
		baseURL: string,
		repositoriesManager: RepositoriesManager,
		repositoryManager: RepositoryManager,
	) {
		this.page = page;
		this.baseURL = baseURL;
		this.repositoriesManager = repositoriesManager;
		this.repositoryManager = repositoryManager;
		this.client = createClient(
			new URL("/api/v2", repositoryManager.getBaseCdnURL()).toString(),
			{ routes: [{ type: "page", path: "/:uid" }] },
		);

		// Locators
		this.toolbarScript = page.locator('script[src*="prismic.io/prismic.js"]');
		this.toolbar = page.locator("#prismic-toolbar-v2 .PreviewMenu");
		this.payload = page.getByTestId("payload");
	}

	async goto(path: string) {
		return await this.page.goto(new URL(path, this.baseURL).toString());
	}

	async goToDocument(document: CoreApiDocument) {
		const apiDocument = await this.client.getByID(document.id);
		return await this.goto(apiDocument.url!);
	}

	async createNewDraft(document: CoreApiDocument, payload: string) {
		return await createNewDraft(
			this.repositoriesManager,
			this.repositoryManager,
			document,
			payload,
		);
	}

	async getPreview() {
		const token = await this.repositoriesManager.getUserApiToken();
		const res = await fetch(
			new URL(
				"/core/repository/preview_configs",
				this.repositoryManager.getBaseURL(),
			),
			{ headers: { authorization: `Bearer ${token}` } },
		);
		const json = (await res.json()) as { results: Preview[] };

		const preview = json.results.find(
			(preview) => new URL(preview.url).origin === this.baseURL,
		);
		if (!preview) throw new Error("Could not find preview");

		return preview;
	}

	async getPreviewSession(document: CoreApiDocument) {
		const preview = await this.getPreview();
		return await getPreviewSession(
			this.repositoriesManager,
			this.repositoryManager,
			document.id,
			document.versions[0].version_id,
			preview.id,
		);
	}

	async setPreviewSessionCookie(sessionID: string) {
		await this.page.context().addCookies([
			{
				name: "io.prismic.previewSession",
				value: sessionID,
				domain: new URL(this.repositoryManager.getBaseURL()).hostname,
				path: "/",
				secure: true,
				sameSite: "None",
			},
		]);
	}

	async preview(document: CoreApiDocument) {
		const previewSession = await this.getPreviewSession(document);
		this.setPreviewSessionCookie(previewSession.session_id);

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

class AppRouterPage extends DefaultPage {
	constructor(
		page: Page,
		repositoriesManager: RepositoriesManager,
		repositoryManager: RepositoryManager,
	) {
		super(
			page,
			"http://localhost:4321",
			repositoriesManager,
			repositoryManager,
		);
	}
}

class PagesRouterPage extends DefaultPage {
	constructor(
		page: Page,
		repositoriesManager: RepositoriesManager,
		repositoryManager: RepositoryManager,
	) {
		super(
			page,
			"http://localhost:4322",
			repositoriesManager,
			repositoryManager,
		);
	}
}
