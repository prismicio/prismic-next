import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import * as prismic from "@prismicio/client";

import { NextRequestLike } from "./types";

export type CreateLocaleRedirectConfig = {
	request: NextRequestLike;
	client: Pick<prismic.Client, "getRepository">;
	localeOverrides?: Record<string, string>;
	omitDefaultLocale?: boolean;
};

/**
 * Creates a `Response` that redirects a request to the requester's preferred
 * locale. This function returns `undefined` if the request already contains a
 * locale.
 *
 * @returns A `Response` if the request should be redirected, `undefined`
 *   otherwise.
 */
export const createLocaleRedirect = async (
	config: CreateLocaleRedirectConfig,
): Promise<Response | undefined> => {
	const repository = await config.client.getRepository();

	const locales = repository.languages.map((language) => {
		return config.localeOverrides?.[language.id] ?? language.id;
	});
	const defaultLocale = locales[0];

	const { pathname } = config.request.nextUrl;
	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) {
		return;
	}

	let locale = defaultLocale;

	const headers = {
		"accept-language":
			config.request.headers.get("accept-language") ?? undefined,
	};

	if (headers["accept-language"]) {
		const languages = new Negotiator({ headers }).languages();
		locale = match(languages, locales, defaultLocale);
	}

	if (locale === defaultLocale && config.omitDefaultLocale) {
		return;
	}

	config.request.nextUrl.pathname = `/${locale}${pathname}`;

	return Response.redirect(config.request.nextUrl as URL);
};
