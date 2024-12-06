import { test, expect } from "./test";

test.beforeEach(async ({ appRouterPage }) => {
	await appRouterPage.goto("/PrismicNextLink");
});

test.describe("web links", () => {
	test("renders an internal web link", async ({ page }) => {
		const link = page.getByTestId("internal-web");
		await expect(link).toHaveAttribute("href", "/foo");
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});

	test("renders an external web link", async ({ page }) => {
		const link = page.getByTestId("external-web");
		await expect(link).toHaveAttribute("href", "https://example.com");
		await expect(link).toHaveAttribute("rel", "noreferrer");
		await expect(link).not.toHaveAttribute("target");
	});

	test("renders an external web link with a provided target", async ({
		page,
	}) => {
		const link = page.getByTestId("external-web-with-target-prop");
		await expect(link).toHaveAttribute("target", "foo");
	});

	test("renders an external web link with a provided rel", async ({ page }) => {
		const link = page.getByTestId("external-web-with-rel-prop");
		await expect(link).toHaveAttribute("rel", "foo");
	});

	test("can render an external web link without a rel", async ({ page }) => {
		const link = page.getByTestId("external-web-with-removed-rel");
		await expect(link).not.toHaveAttribute("rel");
	});

	test("can render an external web link with rel derived from a function", async ({
		page,
	}) => {
		const link = page.getByTestId("external-web-with-rel-function");
		await expect(link).toHaveAttribute(
			"rel",
			JSON.stringify({
				href: "https://example.com",
				isExternal: true,
				target: undefined,
			}),
		);
	});
});

test.describe("document links", () => {
	test("renders a document link with a route resolver", async ({ page }) => {
		const link = page.getByTestId("document-link-with-route-resolver");
		await expect(link).toHaveAttribute("href", "/foo");
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});

	test("renders a document link with a link resolver", async ({ page }) => {
		const link = page.getByTestId("document-link-with-link-resolver");
		await expect(link).toHaveAttribute("href", "/foo");
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});
});

test.describe("media links", () => {
	test("renders a media link", async ({ page }) => {
		const link = page.getByTestId("media-link");
		await expect(link).toHaveAttribute("href", "https://example.com/image.png");
		await expect(link).toHaveAttribute("rel", "noreferrer");
		await expect(link).not.toHaveAttribute("target");
	});
});

test.describe("documents", () => {
	test("renders a document link with a route resolver via the document prop", async ({
		page,
	}) => {
		const link = page.getByTestId("document-prop-with-route-resolver");
		await expect(link).toHaveAttribute("href", "/foo");
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});

	test("renders a document link with a link resolver via the document prop", async ({
		page,
	}) => {
		const link = page.getByTestId("document-prop-with-link-resolver");
		await expect(link).toHaveAttribute("href", "/foo");
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});
});

test.describe("href", () => {
	test("renders an external href", async ({ page }) => {
		const link = page.getByTestId("external-href-prop");
		await expect(link).toHaveAttribute("href", "https://example.com");
		// TODO: We should be setting `rel="noreferrer"` with an external `href`.
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});

	test("renders an internal href", async ({ page }) => {
		const link = page.getByTestId("internal-href-prop");
		await expect(link).toHaveAttribute("href", "/foo");
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});

	test("renders an empty string on falsy href", async ({ page }) => {
		const link = page.getByTestId("falsy-href-prop");
		await expect(link).toHaveAttribute("href", "");
		await expect(link).not.toHaveAttribute("rel");
		await expect(link).not.toHaveAttribute("target");
	});
});

test.describe("with text", () => {
	test("renders a link's text as children", async ({ page }) => {
		const link = page.getByTestId("with-text");
		await expect(link).toContainText("foo");
	});

	test("renders the given children, overriding the link's text", async ({
		page,
	}) => {
		const link = page.getByTestId("with-text-override");
		await expect(link).toContainText("override");
	});
});

test.describe("ref", () => {
	test.beforeEach(async ({ appRouterPage }) => {
		await appRouterPage.goto("/PrismicNextLink/client");
	});

	test("forwards ref", async ({ page }) => {
		const link = page.getByTestId("ref");
		await expect(link).toContainText("tagname: A");
	});
});
