import { it, expect } from "vitest";

import * as reactServerLib from "../../src/react-server";
import * as defaultLib from "../../src";

it("has matching exports with the default lib", () => {
	expect(Object.keys(reactServerLib).sort()).toStrictEqual(
		Object.keys(defaultLib).sort(),
	);
});

it("PrismicNextImage is an alias for the default PrismicNextImage", () => {
	expect(reactServerLib.PrismicNextImage).toBe(defaultLib.PrismicNextImage);
});

it("imgixLoader is an alias for the default imgixLoader", () => {
	expect(reactServerLib.imgixLoader).toBe(defaultLib.imgixLoader);
});

it("PrismicNextLink is an alias for the default PrismicNextLink", () => {
	expect(reactServerLib.PrismicNextLink).toBe(defaultLib.PrismicNextLink);
});
