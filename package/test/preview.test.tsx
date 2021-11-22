import test, { beforeEach } from "ava";
import * as prismicT from "@prismicio/types";
import React from "react";
import { PrismicPreview } from "../src";
import { renderJSON } from "./__testutils__/renderJSON";

// global.window;

test("renders <PrismicPreview/>", (t) => {
	const actual = renderJSON(
		<PrismicPreview repoName="test">
			<div>test</div>
		</PrismicPreview>,
	);

	const expected = renderJSON(
		<>
			<div>test</div>
		</>,
	);

	t.deepEqual(actual, expected);
});
