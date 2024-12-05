import { expect, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ImageFieldImage } from "@prismicio/client";
import { createValueMockFactory } from "@prismicio/mock";

import { it } from "./it";

import { PrismicNextImage } from "../src";

const mock = createValueMockFactory({ seed: "PrismicNextLink" });

const filled = withDefaults(mock.image());
const empty = mock.image({ state: "empty" });

const withAlt = withDefaults(mock.image());
withAlt.alt = "foo";
const withoutAlt = withDefaults(mock.image());
withoutAlt.alt = null;

const withFit = withDefaults(mock.image());
const _withFitURL = new URL(withFit.url);
_withFitURL.searchParams.set("fit", "clamp");
withFit.url = _withFitURL.toString();

const withImgixParams = withDefaults(mock.image());
const _withImgixParamsURL = new URL(withImgixParams.url);
_withImgixParamsURL.searchParams.set("sat", "100");
withImgixParams.url = _withImgixParamsURL.toString();

function withDefaults(
	image: ImageFieldImage<"filled">,
): ImageFieldImage<"filled"> {
	return {
		...image,
		url: "https://images.unsplash.com/photo-1472149110793-7aa262859995",
		dimensions: {
			width: 800,
			height: 600,
		},
	};
}

it("renders an image field", async () => {
	const screen = render(
		<PrismicNextImage field={filled} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1920",
		);
	await expect
		.element(image)
		.toHaveAttribute(
			"srcset",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828 1x, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1920 2x",
		);
	await expect.element(image).toHaveAttribute("width", "800");
	await expect.element(image).toHaveAttribute("height", "600");
});

it("renders null when passed an empty field", async () => {
	const screen = render(<PrismicNextImage field={empty} data-testid="image" />);
	const image = screen.getByTestId("image");
	await expect.element(image).not.toBeInTheDocument();
});

it("renders fallback when passed an empty field", async () => {
	const screen = render(
		<div data-testid="image">
			<PrismicNextImage field={empty} fallback="foo" />
		</div>,
	);
	const fallback = screen.getByTestId("image");
	await expect.element(fallback).toContainHTML("foo");
});

it("supports an explicit width", async () => {
	const screen = render(
		<PrismicNextImage field={filled} width={400} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828",
		);
	await expect
		.element(image)
		.toHaveAttribute(
			"srcset",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=640 1x, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828 2x",
		);
	await expect.element(image).toHaveAttribute("width", "400");
	await expect.element(image).toHaveAttribute("height", "300");
});

it("supports an explicit height", async () => {
	const screen = render(
		<PrismicNextImage field={filled} height={300} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828",
		);
	await expect
		.element(image)
		.toHaveAttribute(
			"srcset",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=640 1x, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828 2x",
		);
	await expect.element(image).toHaveAttribute("width", "400");
	await expect.element(image).toHaveAttribute("height", "300");
});

it("supports an explicit width and height", async () => {
	const screen = render(
		<PrismicNextImage
			field={filled}
			width={400}
			height={300}
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828",
		);
	await expect
		.element(image)
		.toHaveAttribute(
			"srcset",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=640 1x, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828 2x",
		);
	await expect.element(image).toHaveAttribute("width", "400");
	await expect.element(image).toHaveAttribute("height", "300");
});

it("handles a non-SafeNumber width", async () => {
	const screen = render(
		<PrismicNextImage
			field={filled}
			// @ts-expect-error - We are purposely providing an invalid value.
			width="NaN"
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1920",
		);
	await expect.element(image).toHaveAttribute("width", "800");
});

it("handles a non-SafeNumber height", async () => {
	const screen = render(
		<PrismicNextImage
			field={filled}
			// @ts-expect-error - We are purposely providing an invalid value.
			height="NaN"
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1920",
		);
	await expect.element(image).toHaveAttribute("height", "600");
});

it("supports sizes", async () => {
	const screen = render(
		<PrismicNextImage
			field={filled}
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=3840",
		);
	await expect
		.element(image)
		.toHaveAttribute(
			"srcset",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=256 256w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=384 384w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=640 640w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=750 750w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=828 828w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1080 1080w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1200 1200w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1920 1920w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=2048 2048w, https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=3840 3840w",
		);
});

it("supports quality", async () => {
	const screen = render(
		<PrismicNextImage field={filled} quality={10} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=max&w=1920&q=10",
		);
});

it("renders the field's alt text", async () => {
	const screen = render(
		<PrismicNextImage field={withAlt} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect.element(image).toHaveAttribute("alt", "foo");
});

it("excludes alt text if the field does not have any", async () => {
	const consoleErrorSpy = vi
		.spyOn(console, "error")
		.mockImplementation(() => void 0);
	const screen = render(
		<PrismicNextImage field={withoutAlt} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect.element(image).not.toHaveAttribute("alt");
	expect(consoleErrorSpy).toHaveBeenCalledWith(
		expect.stringMatching(/missing an "alt" property/),
		withoutAlt.url,
	);
	consoleErrorSpy.mockRestore();
});

it("renders an explicit decorative fallback alt value if given", async () => {
	const screen = render(
		<PrismicNextImage field={withoutAlt} fallbackAlt="" data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect.element(image).toHaveAttribute("alt", "");
});

it("warns if a non-decorative fallback alt value is given", async () => {
	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0);
	render(
		// @ts-expect-error - Purposely giving incompatible props.
		<PrismicNextImage field={withoutAlt} fallbackAlt="foo" />,
	);
	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/alt-must-be-an-empty-string/),
	);
});

it("renders an explicit decorative alt", async () => {
	const screen = render(
		<PrismicNextImage field={withoutAlt} alt="" data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect.element(image).toHaveAttribute("alt", "");
});

it("supports the fill prop", async () => {
	const screen = render(
		<PrismicNextImage field={filled} fill data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect.element(image).toHaveStyle({ position: "absolute" });
});

it("supports imgix parameters", async () => {
	const screen = render(
		<PrismicNextImage
			field={filled}
			imgixParams={{ sat: -100 }}
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?sat=-100&fit=max&w=1920",
		);
});

it("supports overriding imgix parameters", async () => {
	const screen = render(
		<PrismicNextImage
			field={withImgixParams}
			imgixParams={{ sat: -100 }}
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?sat=-100&fit=max&w=1920",
		);
});

it("retains fit parameter if it is already included in the image URL", async () => {
	const screen = render(
		<PrismicNextImage field={withFit} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=clamp&w=1920",
		);
});

it("allows overriding fit via imgixParams prop", async () => {
	const screen = render(
		<PrismicNextImage
			field={filled}
			imgixParams={{ fit: "facearea" }}
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"https://images.unsplash.com/photo-1472149110793-7aa262859995?fit=facearea&w=1920",
		);
});

it("allows using the default loader", async () => {
	const screen = render(
		<PrismicNextImage field={filled} loader={null} data-testid="image" />,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute("src", expect.stringMatching(/^\/_next\/image\?url=/));
});

it("supports imgix parameters when using the default loader", async () => {
	const screen = render(
		<PrismicNextImage
			field={filled}
			loader={null}
			imgixParams={{ sat: -100 }}
			data-testid="image"
		/>,
	);
	const image = screen.getByTestId("image");
	await expect
		.element(image)
		.toHaveAttribute(
			"src",
			"/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1472149110793-7aa262859995%3Fsat%3D-100&w=1920&q=75",
		);
});
