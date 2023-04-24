import { test, expect, vi } from "vitest";

import { renderJSON } from "./__testutils__/renderJSON";

import { PrismicNextImage } from "../src";

test("renders a NextImage for a given field", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(<PrismicNextImage field={field} />);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop 1x"',
	);
	expect(img?.props.width).toBe(field.dimensions.width);
	expect(img?.props.height).toBe(field.dimensions.height);
});

test("renders null when passed an empty field", (ctx) => {
	const field = ctx.mock.value.image({ state: "empty" });

	const img = renderJSON(<PrismicNextImage field={field} />);

	expect(img).toBe(null);
});

test("renders fallback when passed an empty field", (ctx) => {
	const field = ctx.mock.value.image({ state: "empty" });
	const fallback = <div>custom fallback</div>;

	const img = renderJSON(
		<PrismicNextImage field={field} fallback={fallback} />,
	);
	const expected = renderJSON(fallback);

	expect(img).toStrictEqual(expected);
});

test("supports an explicit width", (ctx) => {
	const field = ctx.mock.value.image();

	// Force consistent dimensions to avoid changes in the mock values.
	field.dimensions.width = 800;
	field.dimensions.height = 600;

	const img = renderJSON(<PrismicNextImage field={field} width="400" />);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=828&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=640&fit=crop 1x, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=828&fit=crop 2x"',
	);
	expect(img?.props.width).toBe(400);
	expect(img?.props.height).toBe(300);
});

test("supports an explicit height", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(<PrismicNextImage field={field} height="600" />);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=828&fit=crop 1x, https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=1920&fit=crop 2x"',
	);
	expect(img?.props.width).toBe(800);
	expect(img?.props.height).toBe(600);
});

test("supports an explicit width and height", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(
		<PrismicNextImage field={field} width="400" height="300" />,
	);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=828&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=640&fit=crop 1x, https://images.unsplash.com/reserve/HgZuGu3gSD6db21T3lxm_San%20Zenone.jpg?w=828&fit=crop 2x"',
	);
});

test("handles a non-SafeNumber width and height", (ctx) => {
	const field = ctx.mock.value.image();

	const widthImg = renderJSON(
		<PrismicNextImage
			field={field}
			// @ts-expect-error - We are purposely providing an invalid value.
			width="NaN"
		/>,
	);
	const heightImg = renderJSON(
		<PrismicNextImage
			field={field}
			// @ts-expect-error - We are purposely providing an invalid value.
			height="NaN"
		/>,
	);

	expect(widthImg?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop"',
	);
	expect(heightImg?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=3840&fit=crop"',
	);
});

test("supports sizes", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(
		<PrismicNextImage
			field={field}
			sizes="(max-width: 768px) 100vw,
				(max-width: 1200px) 50vw,
				33vw"
		/>,
	);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=3840&fit=crop"',
	);
	expect(img?.props.srcSet).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=256&fit=crop 256w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=384&fit=crop 384w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=640&fit=crop 640w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=750&fit=crop 750w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=828&fit=crop 828w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1080&fit=crop 1080w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&fit=crop 1200w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&fit=crop 1920w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=2048&fit=crop 2048w, https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=3840&fit=crop 3840w"',
	);
});

test("supports quality", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(<PrismicNextImage field={field} quality={10} />);

	expect(img?.props.src).toMatchInlineSnapshot(
		'"https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=3840&fit=crop&q=10"',
	);
});

test("uses the field's alt if given", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = "foo";

	const img = renderJSON(<PrismicNextImage field={field} />);

	expect(img?.props.alt).toBe(field.alt);
});

test("alt is undefined if the field does not have an alt value", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = null;

	const img = renderJSON(<PrismicNextImage field={field} />);

	expect(img?.props.alt).toBe(undefined);
});

test("supports an explicit decorative fallback alt value if given", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = null;

	const img = renderJSON(<PrismicNextImage field={field} fallbackAlt="" />);

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

	const img = renderJSON(<PrismicNextImage field={field} alt="" />);

	expect(img?.props.alt).toBe("");
});

test("supports an explicit decorative alt when field does not have an alt value", (ctx) => {
	const field = ctx.mock.value.image();
	field.alt = null;

	const img = renderJSON(<PrismicNextImage field={field} alt="" />);

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

test("supports the fill prop", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(<PrismicNextImage field={field} fill={true} />);

	expect(img?.props.style).toStrictEqual(
		expect.objectContaining({
			position: "absolute",
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			width: "100%",
			height: "100%",
		}),
	);
});

test("supports imgix parameters", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(
		<PrismicNextImage field={field} imgixParams={{ sat: -100 }} />,
	);

	const src = new URL(img?.props.src);

	expect(src.searchParams.get("sat")).toBe("-100");
});

test("applies fit=max by default", (ctx) => {
	const field = ctx.mock.value.image();
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.delete("fit");
	field.url = fieldURL.toString();

	const img = renderJSON(<PrismicNextImage field={field} />);

	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("max");
});

test("retains fit parameter if already included in the image url", (ctx) => {
	const field = ctx.mock.value.image();
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.set("fit", "clamp");
	field.url = fieldURL.toString();

	const img = renderJSON(<PrismicNextImage field={field} />);

	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("clamp");
});

test("allows overriding fit via imgixParams prop", (ctx) => {
	const field = ctx.mock.value.image();
	const fieldURL = new URL(field.url);
	fieldURL.searchParams.set("fit", "crop");
	field.url = fieldURL.toString();

	const img = renderJSON(
		<PrismicNextImage field={field} imgixParams={{ fit: "facearea" }} />,
	);

	const src = new URL(img?.props.src);

	expect(src.searchParams.get("fit")).toBe("facearea");
});

test("allows falling back to the default loader", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(<PrismicNextImage field={field} loader={undefined} />);

	expect(img?.props.src).toMatch(/^\/_next\/image\?url=/);
});

test("supports imgix parameters when using the default loader", (ctx) => {
	const field = ctx.mock.value.image();

	const img = renderJSON(
		<PrismicNextImage
			field={field}
			imgixParams={{ sat: -100 }}
			loader={undefined}
		/>,
	);

	const src = new URL(img?.props.src, "https://example.com");
	const nextImageOptimizationAPIURL = new URL(
		decodeURIComponent(src.searchParams.get("url") as string),
	);

	expect(nextImageOptimizationAPIURL.searchParams.get("sat")).toBe("-100");
});
