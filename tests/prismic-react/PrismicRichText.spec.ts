import { test, expect } from "../infra";

test.beforeEach(async ({ page }) => {
	await page.goto("/prismic-react/PrismicRichText");
});

test.describe("PrismicRichText with hyperlinks", () => {
	test("renders internal hyperlinks with next/link by default", async ({
		page,
	}) => {
		const container = page.getByTestId("internal-uses-next-link");
		const link = container.locator("a");
		await expect(link).toHaveAttribute("href", "/foo");

		// Verify next/link is used by checking for client-side navigation
		let fullPageLoad = false;
		page.on("load", () => {
			fullPageLoad = true;
		});
		await link.click();
		await page.waitForURL("/foo");
		expect(fullPageLoad).toBe(false);
	});

	test("renders external hyperlinks with a by default", async ({ page }) => {
		const container = page.getByTestId("external-uses-default");
		const link = container.locator("a");
		await expect(link).toHaveAttribute("href", "https://example.com");

		// Verify full page load occurs for external links
		let fullPageLoad = false;
		page.on("load", () => {
			fullPageLoad = true;
		});
		await link.click();
		await page.waitForURL("https://example.com");
		expect(fullPageLoad).toBe(true);
	});
});
