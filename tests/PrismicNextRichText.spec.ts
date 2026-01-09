import { test, expect } from "./infra";

test.beforeEach(async ({ page }) => {
	await page.goto("/PrismicNextRichText");
});

test("renders null when passed an empty field", async ({ page }) => {
	const output = page.getByTestId("empty");
	await expect(output).toBeEmpty();
});

test.describe("image", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("image");
		const output = scope.getByTestId("default");
		expect(await output.innerHTML()).toBe(
			'<p class="block-img"><img alt="alt text" loading="lazy" width="800" height="600" decoding="async" data-nimg="1" style="color:transparent" srcset="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;fit=max&amp;w=828 1x, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;fit=max&amp;w=1920 2x" src="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;fit=max&amp;w=1920"></p>',
		);
	});

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("image");
		const output = scope.getByTestId("custom");
		expect(await output.innerHTML()).toBe(
			'<img data-custom="true" src="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format,compress" alt="">',
		);
	});

	test("with link", async ({ page }) => {
		const scope = page.getByTestId("image");
		const output = scope.getByTestId("with-link");
		expect(await output.innerHTML()).toBe(
			'<p class="block-img"><a href="/foo"><img alt="alt text" loading="lazy" width="800" height="600" decoding="async" data-nimg="1" style="color:transparent" srcset="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;fit=max&amp;w=828 1x, https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;fit=max&amp;w=1920 2x" src="https://images.prismic.io/prismicio-next-test/Z1evSZbqstJ98PkD_image.jpg?auto=format%2Ccompress&amp;fit=max&amp;w=1920"></a></p>',
		);
	});
});

test.describe("hyperlink", () => {
	test("default", async ({ page }) => {
		const scope = page.getByTestId("hyperlink");
		const output = scope.getByTestId("default");
		expect(await output.innerHTML()).toBe(
			'<p><a target="_self" href="/foo">foo</a></p>',
		);
	});

	test("custom", async ({ page }) => {
		const scope = page.getByTestId("hyperlink");
		const output = scope.getByTestId("custom");
		expect(await output.innerHTML()).toBe(
			'<p><a data-custom="true" href="/foo">foo</a></p>',
		);
	});
});
