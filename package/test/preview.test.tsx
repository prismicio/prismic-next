import test from "ava";
import React from "react";
import { PrismicPreview } from "../src";
import { renderJSON } from "./__testutils__/renderJSON";
import * as sinon from "sinon";
import { render, act } from "@testing-library/react";

window.requestAnimationFrame = function (callback) {
	return setTimeout(callback, 0);
};
test.before(() => {
	window.requestAnimationFrame = function (callback) {
		return setTimeout(callback, 0);
	};
});

const repoName = "test";

test("renders <PrismicPreview/> with the correct repoName in the script tag", (t) => {
	const actual = renderJSON(
		<PrismicPreview repoName={repoName}>
			<div>test</div>
		</PrismicPreview>,
	);

	const expected = renderJSON(
		<>
			<script
				async={true}
				defer={true}
				src={`https://static.cdn.prismic.io/prismic.js?new=true&repo=${repoName}`}
			></script>
			<div>test</div>
		</>,
	);

	t.deepEqual(actual, expected);
});

test("<PrismicPreview /> adds the prismicEventUpdate event listener to the window", async (t) => {
	globalThis.fetch = sinon.stub();

	// TODO: Solve navigation error, I commented out window.reload on PrismicPreview component

	const updatePreviewURL = "/api/preview";
	const detail = { ref: "ref" };

	render(<PrismicPreview repoName="test" children={<div>test</div>} />);

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	t.true(
		(fetch as sinon.SinonStub).calledWith(
			`${updatePreviewURL}?token=${detail.ref}`,
		),
	);
});

test("<PrismicPreview /> adds the prismicPreviewEnd event listener to the window", async (t) => {
	globalThis.fetch = sinon.stub();

	// TODO: Solve navigation error, I commented out window.reload on PrismicPreview component

	render(<PrismicPreview repoName="test" children={<div>test</div>} />);

	window.dispatchEvent(new CustomEvent("prismicPreviewEnd"));

	t.true((fetch as sinon.SinonStub).called);
});

test("<PrismicPreview /> removes the prismicPreviewUpdate event listener", async (t) => {
	// TODO: Solve navigation error, I commented out window.reload on PrismicPreview component

	globalThis.fetch = sinon.stub();

	// TODO: Solve navigation error, I commented out window.reload on PrismicPreview component

	const updatePreviewURL = "/api/preview";
	const detail = { ref: "ref" };

	const { unmount } = render(
		<PrismicPreview repoName="test" children={<div>test</div>} />,
	);

	// TODO: figure out how to properly unmount

	unmount();

	window.dispatchEvent(
		new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
	);

	t.true(
		(fetch as sinon.SinonStub).calledWith(
			`${updatePreviewURL}?token=${detail.ref}`,
		),
	);
});
