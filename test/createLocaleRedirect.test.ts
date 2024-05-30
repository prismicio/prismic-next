import { vi, it, expect } from "vitest";
import * as prismic from "@prismicio/client";

import { CreateLocaleRedirectConfig, createLocaleRedirect } from "../src";

type CreateRequestArgs = {
	url: string;
	acceptLanguage: string | null;
};
const createRequest = (
	args: CreateRequestArgs,
): CreateLocaleRedirectConfig["request"] => {
	const url = new URL(args.url);

	return {
		url: url.toString(),
		nextUrl: url,
		headers: {
			get: vi.fn((name) =>
				name.toLowerCase() === "accept-language" ? args.acceptLanguage : null,
			),
		},
	};
};

type MockGetRepositoryArgs = {
	client: prismic.Client;
} & Partial<prismic.Repository>;

const mockGetRepository = ({
	client,
	...repository
}: MockGetRepositoryArgs) => {
	vi.spyOn(client, "getRepository").mockImplementation(
		async () => repository as prismic.Repository,
	);
};

it("creates a redirect with the request's preferred locale", async () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });

	const config: CreateLocaleRedirectConfig = {
		client,
		request: createRequest({
			url: "https://example.com/foo",
			acceptLanguage: "fr-fr,fr;q=0.5",
		}),
	};

	mockGetRepository({
		client,
		languages: [{ id: "fr-fr", name: "French (France)" }],
	});

	const redirect = await createLocaleRedirect(config);

	expect(redirect?.headers.get("location")).toBe(
		"https://example.com/fr-fr/foo",
	);
	expect(redirect?.status).toBe(302);
});

it("returns undefined if the request already contains a locale", async () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });

	const config: CreateLocaleRedirectConfig = {
		client,
		request: createRequest({
			url: "https://example.com/en-us/foo",
			acceptLanguage: "fr-fr,fr;q=0.5",
		}),
	};

	mockGetRepository({
		client,
		languages: [
			{ id: "fr-fr", name: "French (France)" },
			{ id: "en-us", name: "English (US)" },
		],
	});

	const redirect = await createLocaleRedirect(config);

	expect(redirect).toBe(undefined);
});

it("uses the default locale if the request's preferred language is unavailable", async () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });

	const config: CreateLocaleRedirectConfig = {
		client,
		request: createRequest({
			url: "https://example.com/foo",
			acceptLanguage: "fr-fr,fr;q=0.5",
		}),
	};

	mockGetRepository({
		client,
		languages: [
			{ id: "en-us", name: "English (US)" },
			{ id: "en-uk", name: "English (UK)" },
		],
	});

	const redirect = await createLocaleRedirect(config);

	expect(redirect?.headers.get("location")).toBe(
		"https://example.com/en-us/foo",
	);
	expect(redirect?.status).toBe(302);
});

it("allows for custom locale codes", async () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });

	const config: CreateLocaleRedirectConfig = {
		client,
		request: createRequest({
			url: "https://example.com/foo",
			acceptLanguage: "fr-fr,fr;q=0.5",
		}),
		localeOverrides: {
			"fr-fr": "jp",
		},
	};

	mockGetRepository({
		client,
		languages: [{ id: "fr-fr", name: "French (France)" }],
	});

	const redirect = await createLocaleRedirect(config);

	expect(redirect?.headers.get("location")).toBe("https://example.com/jp/foo");
	expect(redirect?.status).toBe(302);
});

it("returns undefined when omitDefaultLocale is true and the preferred locale is the default locale", async () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });

	const config: CreateLocaleRedirectConfig = {
		client,
		request: createRequest({
			url: "https://example.com/foo",
			acceptLanguage: "fr-fr,fr;q=0.5",
		}),
		omitDefaultLocale: true,
	};

	mockGetRepository({
		client,
		languages: [{ id: "fr-fr", name: "French (France)" }],
	});

	const redirect = await createLocaleRedirect(config);

	expect(redirect).toBe(undefined);
});

it("uses the default locale when the accept-language header is not set", async () => {
	const client = prismic.createClient("qwerty", { fetch: vi.fn() });

	const config: CreateLocaleRedirectConfig = {
		client,
		request: createRequest({
			url: "https://example.com/foo",
			acceptLanguage: null,
		}),
	};

	mockGetRepository({
		client,
		languages: [{ id: "fr-fr", name: "French (France)" }],
	});

	const redirect = await createLocaleRedirect(config);

	expect(redirect?.headers.get("location")).toBe(
		"https://example.com/fr-fr/foo",
	);
	expect(redirect?.status).toBe(302);
});
