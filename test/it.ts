/* eslint react-hooks/rules-of-hooks: 0 */

import { test, vi } from "vitest";
import { Client, FetchLike, createClient } from "@prismicio/client";
import { MockFactory, createMockFactory } from "@prismicio/mock";

export type Fixtures = {
	repositoryName: string;
	mock: MockFactory;
	fetch: FetchLike;
	client: Client;
	activeCookie: string;
	inactiveCookie: string;
};

export const it = test.extend<Fixtures>({
	mock: async ({ task }, use) => {
		await use(createMockFactory({ seed: task.name }));
	},
	repositoryName: async ({ task }, use) => {
		const repositoryName = await sha1(task.name);
		await use(repositoryName);
	},
	// eslint-disable-next-line no-empty-pattern
	fetch: async ({}, use) => {
		const fetch = vi.fn<FetchLike>(async () => Response.json({}));

		await use(fetch);
	},
	client: async ({ repositoryName, fetch, mock }, use) => {
		vi.mocked(fetch).mockImplementation(async (rawURL) => {
			const url = new URL(rawURL);

			if (url.pathname === "/api/v2")
				return Response.json(mock.api.repository());

			if (url.pathname === "/api/v2/documents/search")
				return Response.json(mock.api.query());

			return new Response();
		});

		const client = createClient(repositoryName, { fetch });

		await use(client);
	},
	activeCookie: async ({ repositoryName }, use) => {
		const cookie = JSON.stringify({
			_tracker: "abc123",
			[`${repositoryName}.prismic.io`]: {
				preview: `https://${repositoryName}.prismic.io/previews/abc:123?websitePreviewId=xyz`,
			},
		});

		await use(cookie);
	},
	// eslint-disable-next-line no-empty-pattern
	inactiveCookie: async ({}, use) => {
		const cookie = JSON.stringify({ _tracker: "abc123" });

		await use(cookie);
	},
});

async function sha1(input: string) {
	const data = new TextEncoder().encode(input);
	const hash = await crypto.subtle.digest("SHA-1", data);
	const hashArray = Array.from(new Uint8Array(hash));

	return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
