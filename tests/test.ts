/* eslint react-hooks/rules-of-hooks: 0 */
import { Locator, Page, test as base, expect } from "@playwright/test";
import {
	RepositoriesManager,
	RepositoryManager,
	createRepositoriesManager,
} from "@prismicio/e2e-tests-utils";
import { createClient } from "@prismicio/client";
import assert from "assert";

export { expect } from "@playwright/test";

export type CoreApiDocument = Awaited<
	ReturnType<RepositoryManager["createDocument"]>
>;

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
	},
	repository: async ({ page, repositoriesManager, baseURL }, use) => {
		assert(baseURL, "A baseURL must be configured to test Prismic previews.");
		const cookies = await page.context().cookies();
		const repositoryName = cookies.find(
			(cookie) => cookie.name === "repository-name",
		)?.value;
		assert(
			repositoryName,
			"There is no repository-name cookie. The setup project must run first.",
		);
		const repository = repositoriesManager.getRepositoryManager(repositoryName);
		const previewConfigs = await getPreviewConfigs(
			repositoriesManager,
			repository,
		);
		const previewConfig = previewConfigs.find(
			(config) => new URL(config.url).origin === baseURL,
		);
		if (!previewConfig) {
			await repository.createPreview({
				name: baseURL,
				websiteURL: baseURL,
				resolverPath: "/api/preview",
			});
		}
		await use(repository);
	},
	pageDocument: async ({ repositoriesManager, repository }, use) => {
		const document = await getDocumentByUID(
			repositoriesManager,
			repository,
			"page",
			"published",
		);
		await use(document);
	},
	unpublishedPageDocument: async ({ repositoriesManager, repository }, use) => {
		const document = await getDocumentByUID(
			repositoriesManager,
			repository,
			"page",
			"unpublished",
		);
		await use(document);
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

	async #getPreviewConfigs() {
		return await getPreviewConfigs(
			this.repositoriesManager,
			this.repositoryManager,
		);
	}
}

async function getPreviewConfigs(
	repositoriesManager: RepositoriesManager,
	repository: RepositoryManager,
): Promise<CoreApiPreview[]> {
	const token = await repositoriesManager.getUserApiToken();
	const res = await fetch(
		new URL("/core/repository/preview_configs", repository.getBaseURL()),
		{ headers: { authorization: `Bearer ${token}` } },
	);
	const json = await res.json();

	return json.results;
}

async function getDocumentByUID(
	repositoriesManager: RepositoriesManager,
	repository: RepositoryManager,
	type: string,
	uid: string,
): Promise<CoreApiDocument> {
	const token = await repositoriesManager.getUserApiToken();
	const url = new URL("/core/documents", repository.getBaseURL());
	url.searchParams.set("uid", uid);
	const res = await fetch(url, {
		headers: { authorization: `Bearer ${token}` },
	});
	const json: { results: CoreApiDocument[] } = await res.json();

	const document = json.results.find(
		(result) => result.custom_type_id === type,
	);
	assert(
		document,
		`Did not find document with type "${type}" and UID "${uid}".`,
	);
	return document;
}
