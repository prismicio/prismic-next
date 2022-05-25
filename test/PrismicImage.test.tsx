import { test, expect, vi } from "vitest";
import * as React from "react";
import * as renderer from "react-test-renderer";
import * as prismicM from "@prismicio/mock";

import { PrismicNextImage } from "../src";

/**
 * Renders a JSON representation of a React.Element. This is a helper to reduce
 * boilerplate in each test.
 *
 * @param element - The React.Element to render.
 *
 * @returns The JSON representation of `element`.
 */
export const renderJSON = (
	element: React.ReactElement,
	options?: renderer.TestRendererOptions,
): renderer.ReactTestRendererJSON | null => {
	let root: renderer.ReactTestRenderer;

	renderer.act(() => {
		root = renderer.create(element, options);
	});

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return root!.toJSON() as renderer.ReactTestRendererJSON;
};

const getImg = (
	rendererJSON: renderer.ReactTestRendererJSON | null,
): renderer.ReactTestRendererJSON | undefined => {
	const noscript = rendererJSON?.children?.find(
		(child) => (child as renderer.ReactTestRendererJSON).type === "noscript",
	) as renderer.ReactTestRendererJSON;

	if (noscript.children) {
		return noscript.children.find(
			(child) => (child as renderer.ReactTestRendererJSON).type === "img",
		) as renderer.ReactTestRendererJSON;
	}
};

test("renders null when passed an empty field", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed, state: "empty" });

	const res = renderJSON(<PrismicNextImage field={field} />);

	expect(res).toBe(null);
});

test("renders a NextImage for a given field", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=3840&fit=crop 1x"',
	);
});

test('supports layout="responsive"', () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(
		<PrismicNextImage field={field} layout="responsive" />,
	);
	const img = getImg(res);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=640&fit=crop 640w, https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=750&fit=crop 750w, https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=828&fit=crop 828w, https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=1080&fit=crop 1080w, https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=1200&fit=crop 1200w, https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=1920&fit=crop 1920w, https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=2048&fit=crop 2048w, https://images.unsplash.com/photo-1431794062232-2a99a5431c6c?w=3840&fit=crop 3840w"',
	);
});

test('supports layout="fill"', () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(<PrismicNextImage field={field} layout="fill" />);
	const img = getImg(res);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=640&fit=crop 640w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=750&fit=crop 750w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=828&fit=crop 828w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&fit=crop 1080w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&fit=crop 1200w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&fit=crop 1920w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2048&fit=crop 2048w, https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop 3840w"',
	);
});

test('supports layout="fixed"', () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(<PrismicNextImage field={field} layout="fixed" />);
	const img = getImg(res);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=3840&fit=crop 1x"',
	);
});

test('supports layout="intrinsic"', () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(<PrismicNextImage field={field} layout="intrinsic" />);
	const img = getImg(res);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=3840&fit=crop 1x"',
	);
});

test("uses the field's alt if given", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	field.alt = "foo";

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);

	expect(img?.props.alt).toBe(field.alt);
});

test("alt is undefined if the field does not have an alt value", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	field.alt = null;

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);

	expect(img?.props.alt).toBe(undefined);
});

test("supports an explicit decorative fallback alt value if given", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	field.alt = null;

	const res = renderJSON(<PrismicNextImage field={field} fallbackAlt="" />);
	const img = getImg(res);

	expect(img?.props.alt).toBe("");
});

test("warns if a non-decorative fallback alt value is given", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0);

	renderJSON(
		// @ts-expect-error - Purposely giving incompatible props.
		<PrismicNextImage field={field} fallbackAlt="non-decorative" />,
	);

	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/alt-must-be-an-empty-string/),
	);

	consoleWarnSpy.mockRestore();
});

test("supports an explicit decorative alt when field has an alt value", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	field.alt = "provided alt";

	const res = renderJSON(<PrismicNextImage field={field} alt="" />);
	const img = getImg(res);

	expect(img?.props.alt).toBe("");
});

test("supports an explicit decorative alt when field does not have an alt value", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	field.alt = null;

	const res = renderJSON(<PrismicNextImage field={field} alt="" />);
	const img = getImg(res);

	expect(img?.props.alt).toBe("");
});

test("warns if a non-decorative alt value is given", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const consoleWarnSpy = vi
		.spyOn(console, "warn")
		.mockImplementation(() => void 0);

	renderJSON(
		// @ts-expect-error - Purposely giving incompatible props.
		<PrismicNextImage field={field} alt="non-decorative" />,
	);

	expect(consoleWarnSpy).toHaveBeenCalledWith(
		expect.stringMatching(/alt-must-be-an-empty-string/),
	);

	consoleWarnSpy.mockRestore();
});

test("supports imgix parameters", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(
		<PrismicNextImage field={field} imgixParams={{ sat: -100 }} />,
	);
	const img = getImg(res);
	const src = new URL(img?.props.src);

	expect(src.searchParams.get("sat")).toBe("-100");
});

test("applies fit=max by default", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.delete("fit");
	field.url = fieldURL.toString();

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);
	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("max");
});

test("retains fit parameter if already included in the image url", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.set("fit", "crop");
	field.url = fieldURL.toString();

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);
	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("crop");
});

test("allows overriding fit via imgixParams prop", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.set("fit", "crop");
	field.url = fieldURL.toString();

	const res = renderJSON(
		<PrismicNextImage field={field} imgixParams={{ fit: "facearea" }} />,
	);
	const img = getImg(res);
	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("facearea");
});

test("allows falling back to the default loader", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(<PrismicNextImage field={field} loader={undefined} />);
	const img = getImg(res);

	expect(img?.props.src).toMatch(/^\/_next\/image\?url=/);
});

test("supports imgix parameters when using the default loader", () => {
	const seed = expect.getState().currentTestName;
	const field = prismicM.value.image({ seed });

	const res = renderJSON(
		<PrismicNextImage
			field={field}
			imgixParams={{ sat: -100 }}
			loader={undefined}
		/>,
	);
	const img = getImg(res);
	const src = new URL(img?.props.src, "https://example.com");
	const nextImageOptimizationAPIURL = new URL(
		decodeURIComponent(src.searchParams.get("url") as string),
	);

	expect(nextImageOptimizationAPIURL.searchParams.get("sat")).toBe("-100");
});
