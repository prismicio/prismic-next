import { it, expect, vi } from "vitest";

import { renderJSON } from "../__testutils__/renderJSON";

import {
	PrismicPreview,
	enableAutoPreviews,
	redirectToPreviewURL,
	exitPreview,
	setPreviewData,
} from "../../src/react-server";

function itThrowsUnsupportedMessage(fn: () => void) {
	it("throws an unsupported message", () => {
		expect(() => fn()).toThrow(/not supported/i);
	});
}

it("PrismicPreview throws an unsupported message", () => {
	const consoleErrorSpy = vi
		.spyOn(globalThis.console, "error")
		.mockImplementation(() => void 0);

	expect(() => {
		renderJSON(<PrismicPreview />);
	}).toThrow(/not supported/i);

	consoleErrorSpy.mockRestore();
});

itThrowsUnsupportedMessage(() => enableAutoPreviews());
itThrowsUnsupportedMessage(() => redirectToPreviewURL());
itThrowsUnsupportedMessage(() => exitPreview());
itThrowsUnsupportedMessage(() => setPreviewData());
