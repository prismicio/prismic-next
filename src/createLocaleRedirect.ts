import { devMsg } from "./lib/devMsg";

/**
 * @deprecated `createLocaleRedirect()` has been removed due to performance
 *   issues.
 */
export function createLocaleRedirect(): never {
	throw new Error(
		`createLocaleRedirect() has been removed due to performance issues. See ${devMsg(
			"replace-createLocaleRedirect",
		)} for more details.`,
	);
}
/**
 * @deprecated `createLocaleRedirect()` has been removed due to performance
 *   issues.
 */
export type CreateLocaleRedirectConfig = never;
