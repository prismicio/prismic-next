# Replace `createLocaleRedirect()`

`createLocaleRedirect()` was provided to simplify internationalization support in Prismic websites. The function redirects websites visitors to a URL with the correct locale from [`middleware.ts`](https://nextjs.org/docs/app/building-your-application/routing/middleware).

The function fetched the Prismic repository's supported locales using the [Repository API](https://prismic.io/docs/repository-api-technical-reference). Unfortunately, that network request could never be cached and introduced a delay to every page, usually around 200 ms.

The function should be removed from Next.js projects to ensure the best possible website performance.

## Recommended replacement

1. Install the `negotiator` and `@formatjs/intl-localematcher` packages:

   ```sh
   npm install negotiator @formatjs/intl-localematcher
   ```

1. Create an `i18n.ts` file at the root of your project (or within `src` if you use that directory):

   ```ts
   import type { NextRequest } from "next/server";
   import { match } from "@formatjs/intl-localematcher";
   import Negotiator from "negotiator";

   /**
    * A record of locales mapped to a version displayed in URLs. The first entry is
    * used as the default locale.
    */
   // TODO: Update this object with your website's supported locales. Keys
   // should be the locale IDs registered in your Prismic account, and values
   // should be the string that appears in the URL.
   const LOCALES = {
   	"en-us": "en",
   	"fr-fr": "fr",
   };

   /** Creates a redirect with an auto-detected locale prepended to the URL. */
   export function createLocaleRedirect(request: NextRequest): Response {
   	const headers = {
   		"accept-language": request.headers.get("accept-language"),
   	};
   	const languages = new Negotiator({ headers }).languages();
   	const locales = Object.keys(LOCALES);
   	const locale = match(languages, locales, locales[0]);

   	request.nextUrl.pathname = `/${LOCALES[locale]}${request.nextUrl.pathname}`;

   	return Response.redirect(request.nextUrl);
   }

   /** Determines if a pathname has a locale as its first segment. */
   export function pathnameHasLocale(request: NextRequest): boolean {
   	const regexp = new RegExp(`^/(${Object.values(LOCALES).join("|")})(\/|$)`);

   	return regexp.test(request.nextUrl.pathname);
   }

   /**
    * Returns the full locale of a given locale. It returns `undefined` if the
    * locale is not in the master list.
    */
   export function reverseLocaleLookup(locale: string): string | undefined {
   	for (const key in LOCALES) {
   		if (LOCALES[key] === locale) {
   			return key;
   		}
   	}
   }
   ```

1. Create or modify your `middleware.ts` file with the following:

   ```ts
   import type { NextRequest } from "next/server";
   import { createLocaleRedirect, pathnameHasLocale } from "@/i18n";

   export async function middleware(request: NextRequest) {
   	if (!pathnameHasLocale(request)) {
   		return createLocaleRedirect(request);
   	}
   }

   export const config = {
   	matcher: ["/((?!_next|api|slice-simulator|icon.svg).*)"],
   };
   ```
