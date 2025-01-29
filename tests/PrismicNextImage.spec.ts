import { test, expect } from "./infra";

test.beforeEach(async ({ page }) => {
	await page.goto("/PrismicNextImage");
});

test("renders an image field", async ({ page }) => {
	const image = page.getByTestId("filled");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1920",
	);
	await expect(image).toHaveAttribute(
		"srcset",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828 1x, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1920 2x",
	);
	await expect(image).toHaveAttribute("width", "800");
	await expect(image).toHaveAttribute("height", "600");
});

test("renders null when passed an empty field", async ({ page }) => {
	const image = page.getByTestId("empty");
	await expect(image).toHaveCount(0);
});

test("renders fallback when passed an empty field", async ({ page }) => {
	const fallback = page.getByTestId("fallback");
	await expect(fallback).toContainText("foo");
});

test("supports an explicit width", async ({ page }) => {
	const image = page.getByTestId("explicit-width");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828",
	);
	await expect(image).toHaveAttribute(
		"srcset",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=640 1x, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828 2x",
	);
	await expect(image).toHaveAttribute("width", "400");
	await expect(image).toHaveAttribute("height", "300");
});

test("supports an explicit height", async ({ page }) => {
	const image = page.getByTestId("explicit-height");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828",
	);
	await expect(image).toHaveAttribute(
		"srcset",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=640 1x, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828 2x",
	);
	await expect(image).toHaveAttribute("width", "400");
	await expect(image).toHaveAttribute("height", "300");
});

test("supports an explicit width and height", async ({ page }) => {
	const image = page.getByTestId("explicit-width-height");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828",
	);
	await expect(image).toHaveAttribute(
		"srcset",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=640 1x, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828 2x",
	);
	await expect(image).toHaveAttribute("width", "400");
	await expect(image).toHaveAttribute("height", "300");
});

test("handles a non-SafeNumber width", async ({ page }) => {
	const image = page.getByTestId("non-safenumber-width");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1920",
	);
	await expect(image).toHaveAttribute("width", "800");
});

test("handles a non-SafeNumber height", async ({ page }) => {
	const image = page.getByTestId("non-safenumber-height");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1920",
	);
	await expect(image).toHaveAttribute("height", "600");
});

test("supports sizes", async ({ page }) => {
	const image = page.getByTestId("sizes");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=3840",
	);
	await expect(image).toHaveAttribute(
		"srcset",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=256 256w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=384 384w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=640 640w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=750 750w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=828 828w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1080 1080w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1200 1200w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1920 1920w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=2048 2048w, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=3840 3840w",
	);
});

test("supports quality", async ({ page }) => {
	const image = page.getByTestId("quality");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&fit=max&w=1920&q=10",
	);
});

test("renders the field's alt text", async ({ page }) => {
	const image = page.getByTestId("with-alt");
	await expect(image).toHaveAttribute("alt", "alt text");
});

test("excludes alt text if the field does not have any", async ({ page }) => {
	const image = page.getByTestId("without-alt");
	await expect(image).not.toHaveAttribute("alt");
});

test("renders an explicit decorative fallback alt value if given", async ({
	page,
}) => {
	const image = page.getByTestId("with-decorative-fallback-alt");
	await expect(image).toHaveAttribute("alt", "");
});

test("renders an explicit decorative alt", async ({ page }) => {
	const image = page.getByTestId("with-decorative-alt");
	await expect(image).toHaveAttribute("alt", "");
});

test("supports the fill prop", async ({ page }) => {
	const image = page.getByTestId("fill");
	await expect(image).toHaveCSS("position", "absolute");
});

test("supports imgix parameters", async ({ page }) => {
	const image = page.getByTestId("imgix");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&sat=-100&fit=max&w=1920",
	);
});

test("supports overriding imgix parameters", async ({ page }) => {
	const image = page.getByTestId("imgix-override");
	await expect(image).toHaveAttribute(
		"src",
		"https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&rect=0%2C0%2C100%2C100&w=640&fit=max",
	);
});

test("allows using the default loader", async ({ page }) => {
	const image = page.getByTestId("default-loader");
	await expect(image).toHaveAttribute("src", /^\/_next\/image\?url=/);
});

test("supports imgix parameters when using the default loader", async ({
	page,
}) => {
	const image = page.getByTestId("default-loader-with-imgixParams");
	await expect(image).toHaveAttribute(
		"src",
		"/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fprismicio-next-test%2FZ1evSZbqstJ98PkD_image.jpg%3Fauto%3Dformat%252Ccompress%26sat%3D-100&w=1920&q=75",
	);
});

test.describe("ref", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/PrismicNextImage/client");
	});

	test("forwards ref", async ({ page }) => {
		const link = page.getByTestId("ref");
		await expect(link).toContainText("tagname: IMG");
	});
});
