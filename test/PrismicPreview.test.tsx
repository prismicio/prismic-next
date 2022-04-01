import test from "ava";
import React from "react";
import { PrismicPreview } from "../src";
import sinon from "sinon";
import { render, cleanup, waitFor } from "@testing-library/react";

// TODO Figure out why there is a navigation error when it comes to window.reload

window.requestAnimationFrame = function (callback) {
	return setTimeout(callback, 0);
};

test.before(() => {
	window.requestAnimationFrame = function (callback) {
		return setTimeout(callback, 0);
	};
});

test.beforeEach(() => {
	globalThis.fetch = sinon.stub();
});

test.afterEach(() => {
	cleanup();
});

test.serial(
	"<PrismicPreview /> adds the prismicEventUpdate event listener to the window",
	async (t) => {
		const updatePreviewURL = "/api/preview";
		const detail = { ref: "ref" };

		render(
			<PrismicPreview repositoryName="test">
				<div>test</div>
			</PrismicPreview>,
		);

		window.dispatchEvent(
			new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
		);

		t.true(
			(globalThis.fetch as sinon.SinonStub).calledWith(
				`${updatePreviewURL}?token=${detail.ref}`,
			),
		);
	},
);

test.serial(
	"<PrismicPreview /> adds the prismicPreviewEnd event listener to the window",
	async (t) => {
		render(
			<PrismicPreview repositoryName="test">
				<div>test</div>
			</PrismicPreview>,
		);

		window.dispatchEvent(
			new CustomEvent("prismicPreviewEnd", { detail: { ref: "ref" } }),
		);

		t.true((globalThis.fetch as sinon.SinonStub).called);
	},
);

test.serial(
	"<PrismicPreview /> removes the prismicPreviewUpdate event listener",
	async (t) => {
		const updatePreviewURL = "/api/preview";
		const detail = { ref: "ref" };

		const { unmount } = render(
			<PrismicPreview repositoryName="test" children={<div>test</div>} />,
		);

		unmount();

		window.dispatchEvent(
			new CustomEvent("prismicPreviewUpdate", { detail: { ref: "ref" } }),
		);

		t.false(
			(globalThis.fetch as sinon.SinonStub).calledWith(
				`${updatePreviewURL}?token=${detail.ref}`,
			),
		);
	},
);

test.only("renders <PrismicPreview/> with the correct repositoryName in the script tag", async (t) => {
	const repoName = "test";
	render(
		<PrismicPreview repositoryName={repoName}>
			<div>test</div>
		</PrismicPreview>,
	);

	const script = await waitFor(() => {
		const result = document.body.querySelector(
			`script[src="https://static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true"]`,
		);

		if (result === null) {
			throw new Error();
		} else {
			return result;
		}
	});

	t.not(script, null);
});