import { test, expect, vi } from "vitest";
// import { test, expect, vi, describe } from "vitest";
import * as React from "react";
import * as renderer from "react-test-renderer";

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

test("renders null when passed an empty field", (ctx) => {
	const field = ctx.mock.value.image({ state: "empty" });

	const res = renderJSON(<PrismicNextImage field={field} />);

	expect(res).toBe(null);
});

test("renders a NextImage for a given field", (ctx) => {
	const field = ctx.mock.value.image();

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop 1x"',
	);
});

// test('supports layout="responsive"', (ctx) => {
// 	const field = ctx.mock.value.image();
//
// 	const res = renderJSON(
// 		<PrismicNextImage field={field} layout="responsive" />,
// 	);
// 	const img = getImg(res);
//
// 	expect(img?.props.src).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=3840&fit=crop"',
// 	);
// 	expect(img?.props.srcSet).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=640&fit=crop 640w, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=750&fit=crop 750w, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=828&fit=crop 828w, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1080&fit=crop 1080w, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1200&fit=crop 1200w, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1920&fit=crop 1920w, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=2048&fit=crop 2048w, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=3840&fit=crop 3840w"',
// 	);
// });
//
// test('supports layout="fill"', (ctx) => {
// 	const field = ctx.mock.value.image();
//
// 	const res = renderJSON(<PrismicNextImage field={field} layout="fill" />);
// 	const img = getImg(res);
//
// 	expect(img?.props.src).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=3840&fit=crop"',
// 	);
// 	expect(img?.props.srcSet).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=640&fit=crop 640w, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=750&fit=crop 750w, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=828&fit=crop 828w, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=1080&fit=crop 1080w, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=1200&fit=crop 1200w, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=1920&fit=crop 1920w, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=2048&fit=crop 2048w, https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=3840&fit=crop 3840w"',
// 	);
// });
//
// test('supports layout="fixed"', (ctx) => {
// 	const field = ctx.mock.value.image();
//
// 	const res = renderJSON(<PrismicNextImage field={field} layout="fixed" />);
// 	const img = getImg(res);
//
// 	expect(img?.props.src).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=3840&fit=crop"',
// 	);
// 	expect(img?.props.srcSet).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=3840&fit=crop 1x"',
// 	);
// });
//
// test('supports layout="intrinsic"', (ctx) => {
// 	const field = ctx.mock.value.image();
//
// 	const res = renderJSON(<PrismicNextImage field={field} layout="intrinsic" />);
// 	const img = getImg(res);
//
// 	expect(img?.props.src).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=3840&fit=crop"',
// 	);
// 	expect(img?.props.srcSet).toMatchInlineSnapshot(
// 		'"https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=3840&fit=crop 1x"',
// 	);
// });

test("uses the field's alt if given", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = "foo";

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);

	expect(img?.props.alt).toBe(field.alt);
});

test("alt is undefined if the field does not have an alt value", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = null;

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);

	expect(img?.props.alt).toBe(undefined);
});

test("supports an explicit decorative fallback alt value if given", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = null;

	const res = renderJSON(<PrismicNextImage field={field} fallbackAlt="" />);
	const img = getImg(res);

	expect(img?.props.alt).toBe("");
});

test("warns if a non-decorative fallback alt value is given", (ctx) => {
	const field = ctx.mock.value.image();

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

test("supports an explicit decorative alt when field has an alt value", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = "provided alt";

	const res = renderJSON(<PrismicNextImage field={field} alt="" />);
	const img = getImg(res);

	expect(img?.props.alt).toBe("");
});

test("supports an explicit decorative alt when field does not have an alt value", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = null;

	const res = renderJSON(<PrismicNextImage field={field} alt="" />);
	const img = getImg(res);

	expect(img?.props.alt).toBe("");
});

test("warns if a non-decorative alt value is given", (ctx) => {
	const field = ctx.mock.value.image();

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

test("supports imgix parameters", (ctx) => {
	const field = ctx.mock.value.image();

	const res = renderJSON(
		<PrismicNextImage field={field} imgixParams={{ sat: -100 }} />,
	);
	const img = getImg(res);
	const src = new URL(img?.props.src);

	expect(src.searchParams.get("sat")).toBe("-100");
});

test("applies fit=max by default", (ctx) => {
	const field = ctx.mock.value.image();
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.delete("fit");
	field.url = fieldURL.toString();

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);
	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("max");
});

test("retains fit parameter if already included in the image url", (ctx) => {
	const field = ctx.mock.value.image();
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.set("fit", "crop");
	field.url = fieldURL.toString();

	const res = renderJSON(<PrismicNextImage field={field} />);
	const img = getImg(res);
	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("crop");
});

test("allows overriding fit via imgixParams prop", (ctx) => {
	const field = ctx.mock.value.image();
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

test("allows falling back to the default loader", (ctx) => {
	const field = ctx.mock.value.image();

	const res = renderJSON(<PrismicNextImage field={field} loader={undefined} />);
	const img = getImg(res);

	expect(img?.props.src).toMatch(/^\/_next\/image\?url=/);
});

test("supports imgix parameters when using the default loader", (ctx) => {
	const field = ctx.mock.value.image();

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

// describe("intrinsic layout (default)", () => {
// 	test("supports automatic dimensiosn", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const res = renderJSON(<PrismicNextImage field={field} />);
// 		const img = getImg(res);
//
// 		expect(img?.props.src).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=1920&fit=crop"',
// 		);
// 		expect(img?.props.srcSet).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=828&fit=crop 1x, https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=1920&fit=crop 2x"',
// 		);
// 	});
//
// 	test("supports explicit width", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const res = renderJSON(<PrismicNextImage field={field} width="400" />);
// 		const img = getImg(res);
//
// 		expect(img?.props.src).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=828&fit=crop"',
// 		);
// 		expect(img?.props.srcSet).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=640&fit=crop 1x, https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=828&fit=crop 2x"',
// 		);
// 	});
//
// 	test("supports explicit height", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const res = renderJSON(<PrismicNextImage field={field} height="400" />);
// 		const img = getImg(res);
//
// 		expect(img?.props.src).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1080&fit=crop"',
// 		);
// 		expect(img?.props.srcSet).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=640&fit=crop 1x, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1080&fit=crop 2x"',
// 		);
// 	});
//
// 	test("throws if invalid width or height is given", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const consoleErrorSpy = vi
// 			.spyOn(console, "error")
// 			.mockImplementation(() => void 0);
//
// 		expect(() => {
// 			renderJSON(<PrismicNextImage field={field} width="NaN" height="NaN" />);
// 		}).toThrow('invalid "width" or "height" property');
//
// 		consoleErrorSpy.mockRestore();
// 	});
// });
//
// describe("fixed layout", () => {
// 	test("supports automatic dimensiosn", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const res = renderJSON(<PrismicNextImage field={field} layout="fixed" />);
// 		const img = getImg(res);
//
// 		expect(img?.props.src).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=1920&fit=crop"',
// 		);
// 		expect(img?.props.srcSet).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=828&fit=crop 1x, https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=1920&fit=crop 2x"',
// 		);
// 	});
//
// 	test("supports explicit width", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const res = renderJSON(
// 			<PrismicNextImage field={field} width="400" layout="fixed" />,
// 		);
// 		const img = getImg(res);
//
// 		expect(img?.props.src).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=828&fit=crop"',
// 		);
// 		expect(img?.props.srcSet).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=640&fit=crop 1x, https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=828&fit=crop 2x"',
// 		);
// 	});
//
// 	test("supports explicit height", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const res = renderJSON(
// 			<PrismicNextImage field={field} height="400" layout="fixed" />,
// 		);
// 		const img = getImg(res);
//
// 		expect(img?.props.src).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1080&fit=crop"',
// 		);
// 		expect(img?.props.srcSet).toMatchInlineSnapshot(
// 			'"https://images.unsplash.com/photo-1444464666168-49d633b86797?w=640&fit=crop 1x, https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1080&fit=crop 2x"',
// 		);
// 	});
//
// 	test("throws if invalid width or height is given", (ctx) => {
// 		const field = ctx.mock.value.image();
// 		field.dimensions.width = 800;
// 		field.dimensions.height = 600;
//
// 		const consoleErrorSpy = vi
// 			.spyOn(console, "error")
// 			.mockImplementation(() => void 0);
//
// 		expect(() => {
// 			renderJSON(
// 				<PrismicNextImage
// 					field={field}
// 					width="NaN"
// 					height="NaN"
// 					layout="fixed"
// 				/>,
// 			);
// 		}).toThrow('invalid "width" or "height" property');
//
// 		consoleErrorSpy.mockRestore();
// 	});
// });
