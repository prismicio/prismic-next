import * as React from "react";
import * as renderer from "react-test-renderer";

/**
 * Renders a React.Element. This is a helper to reduce boilerplate in each test.
 *
 * @param element - The React.Element to render.
 *
 * @returns The React test renderer instance of `element`.
 */
export const render = (
	element: React.ReactElement,
	options?: renderer.TestRendererOptions,
): renderer.ReactTestRenderer => {
	let root: renderer.ReactTestRenderer;

	renderer.act(() => {
		root = renderer.create(element, options);
	});

	return root!;
};
