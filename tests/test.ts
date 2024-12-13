/* eslint react-hooks/rules-of-hooks: 0 */
import { Locator, Page, test as base, expect } from "@playwright/test";
import {
	RepositoriesManager,
	RepositoryManager,
	createRepositoriesManager,
} from "@prismicio/e2e-tests-utils";
import { createClient } from "@prismicio/client";
import assert from "assert";

import * as data from "./data";

export { expect } from "@playwright/test";

type CoreApiDocument = Awaited<ReturnType<RepositoryManager["createDocument"]>>;
type CoreApiPreview = { id: string; label: string; url: string };

type Fixtures = {
	repositoriesManager: RepositoriesManager;
	repository: RepositoryManager;
	linkDocument: CoreApiDocument;
	imageDocument: CoreApiDocument;
	pageDocument: CoreApiDocument;
	unpublishedPageDocument: CoreApiDocument;
	appPage: AppPage;
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
	repository: async ({ repositoriesManager, baseURL, context }, use) => {
		assert(baseURL, "A baseURL must be configured to test Prismic previews.");
		const repository = await repositoriesManager.createRepository({
			prefix: "prismicio-next",
			defaultLocale: "fr-fr",
			preview: {
				name: "preview",
				websiteURL: baseURL,
				resolverPath: "/api/preview",
			},
		});
		await context.addCookies([
			{
				name: "repository-name",
				value: repository.name,
				domain: new URL(baseURL).hostname,
				path: "/",
			},
		]);
		await use(repository);
	},
	pageDocument: async ({ repository }, use) => {
		await repository.createCustomTypes([data.page.model]);
		const document = await repository.createDocument(
			{
				custom_type_id: "page",
				title: test.info().title,
				tags: [],
				integration_field_ids: [],
				data: data.page.content(),
			},
			"published",
		);
		await use(document);
	},
	unpublishedPageDocument: async ({ repository }, use) => {
		await repository.createCustomTypes([data.page.model]);
		const document = await repository.createDocument(
			{
				custom_type_id: "page",
				title: test.info().title,
				tags: [],
				integration_field_ids: [],
				data: data.page.content(),
			},
			"draft",
		);
		await use(document);
	},
	linkDocument: async ({ repository, pageDocument }, use) => {
		await repository.createCustomTypes([data.link.model]);
		const linkDocument = await repository.createDocument(
			{
				custom_type_id: "link_test",
				title: test.info().title,
				tags: [],
				integration_field_ids: [],
				data: data.link.content(undefined, {
					documentLinkID: pageDocument.id,
				}),
			},
			"published",
		);
		await use(linkDocument);
	},
	imageDocument: async ({ repository }, use) => {
		await repository.createCustomTypes([data.image.model]);
		const imageDocument = await repository.createDocument(
			{
				custom_type_id: "image_test",
				title: test.info().title,
				tags: [],
				integration_field_ids: [],
				data: data.image.content(),
			},
			"published",
		);
		await use(imageDocument);
	},
	appPage: async ({ page, repositoriesManager, repository }, use) => {
		const appPage = new AppPage(page, repositoriesManager, repository);
		await use(appPage);
	},
});

class AppPage {
	page: Page;
	repositoriesManager: RepositoriesManager;
	repositoryManager: RepositoryManager;

	// Locators
	toolbarScript: Locator;
	toolbar: Locator;
	payload: Locator;

	constructor(
		page: Page,
		repositoriesManager: RepositoriesManager,
		repositoryManager: RepositoryManager,
	) {
		this.page = page;
		this.repositoriesManager = repositoriesManager;
		this.repositoryManager = repositoryManager;

		// Locators
		this.toolbarScript = page.locator('script[src*="prismic.io/prismic.js"]');
		this.toolbar = page.locator("#prismic-toolbar-v2 .PreviewMenu");
		this.payload = page.getByTestId("payload");
	}

	async goToDocument(document: CoreApiDocument, pathPrefix = "") {
		const client = createClient(
			new URL("/api/v2", this.repositoryManager.getBaseCdnURL()).toString(),
			{
				routes: [
					{ type: "page", path: "/:uid" },
					{ type: "link_test", path: "/PrismicNextLink/:uid" },
					{ type: "image_test", path: "/PrismicNextImage/:uid" },
				].filter((route) => route.type === document.custom_type_id),
			},
		);
		const apiDocument = await client.getByID(document.id);
		return await this.page.goto(pathPrefix + apiDocument.url!);
	}

	async createNewDraft(
		document: CoreApiDocument,
		content: (uid?: string) => unknown,
	) {
		const baseVersion = document.versions[0];

		const token = await this.repositoriesManager.getUserApiToken();
		const url = new URL(
			`/core/documents/${document.id}/draft`,
			this.repositoryManager.getBaseURL(),
		);
		url.searchParams.set("base_version_id", baseVersion.version_id);
		const res = await fetch(url, {
			method: "put",
			headers: {
				authorization: `Bearer ${token}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({
				data: content(baseVersion.uid),
				integration_field_ids: [],
				tags: [],
			}),
		});
		return await res.json();
	}

	async getPreviewSession(document: CoreApiDocument) {
		const configs = await this.#getPreviewConfigs();
		const config = configs[0];
		assert(config, "At least one preview must be configured.");

		const token = await this.repositoriesManager.getUserApiToken();
		const url = new URL(
			"/core/previews/session/draft",
			this.repositoryManager.getBaseURL(),
		);
		url.searchParams.set("previewId", config.id);
		url.searchParams.set("documentId", document.id);
		url.searchParams.set("versionId", document.versions[0].version_id);

		const res = await fetch(url, {
			headers: { authorization: `Bearer ${token}` },
		});
		return await res.json();
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

	async #getPreviewConfigs(): Promise<CoreApiPreview[]> {
		const token = await this.repositoriesManager.getUserApiToken();
		const res = await fetch(
			new URL(
				"/core/repository/preview_configs",
				this.repositoryManager.getBaseURL(),
			),
			{ headers: { authorization: `Bearer ${token}` } },
		);
		const json = await res.json();

		return json.results;
	}
}
