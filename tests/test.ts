import { Locator, Page, test as base } from "@playwright/test";

export { expect } from "@playwright/test";

type Fixtures = {
	appRouterPage: AppRouterPage;
	pagesRouterPage: PagesRouterPage;
};

export const test = base.extend<Fixtures>({
	appRouterPage: async ({ page }, use) => {
		await use(new AppRouterPage(page));
	},
	pagesRouterPage: async ({ page }, use) => {
		await use(new PagesRouterPage(page));
	},
});

class DefaultPage {
	page: Page;
	baseURL: string;
	toolbarScript: Locator;

	constructor(page: Page, baseURL: string) {
		this.page = page;
		this.baseURL = baseURL;

		// Locators
		this.toolbarScript = page.locator('script[src*="prismic.io/prismic.js"]');
	}

	async goto(path: string) {
		await this.page.goto(new URL(path, this.baseURL).toString());
	}

	async waitForRequest(path: string) {
		return await this.page.waitForRequest(
			new URL(path, this.baseURL).toString(),
		);
	}

	async waitForTimestampChange() {
		await this.page.waitForFunction(
			(initialContent) =>
				document.querySelector('[data-testid="timestamp"]')?.textContent !==
				initialContent,
			await this.page.getByTestId("timestamp").textContent(),
		);
	}

	async dispatchPreviewUpdateEvent(ref = "ref") {
		return await this.page
			.locator("body")
			.dispatchEvent("prismicPreviewUpdate", { detail: { ref } });
	}

	async dispatchPreviewEndEvent() {
		return await this.page.locator("body").dispatchEvent("prismicPreviewEnd");
	}

	async getToolbarScriptParam(name: string) {
		const src = await this.toolbarScript.getAttribute("src");
		return new URL(src ?? "").searchParams.get(name);
	}
}

class AppRouterPage extends DefaultPage {
	constructor(page: Page) {
		super(page, "http://localhost:4321");
	}
}

class PagesRouterPage extends DefaultPage {
	constructor(page: Page) {
		super(page, "http://localhost:4322");
	}
}
