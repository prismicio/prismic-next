import { test, expect } from "../infra";

test.beforeEach(async ({ page }) => {
	await page.goto("/prismic-react/PrismicLink");
});

test.describe("PrismicLink with next/link", () => {
	test("renders internal links with next/link by default", async ({ page }) => {
		const link = page.getByTestId("internal-uses-next-link");
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

	test("renders external links with a by default", async ({ page }) => {
		const link = page.getByTestId("external-uses-default");
		await expect(link).toHaveAttribute("href", "https://example.com");

		// Verify next/link is used by checking for client-side navigation
		let fullPageLoad = false;
		page.on("load", () => {
			fullPageLoad = true;
		});
		await link.click();
		await page.waitForURL("https://example.com");
		expect(fullPageLoad).toBe(true);
	});
});
