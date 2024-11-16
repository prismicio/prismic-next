import { devMsg } from "./lib/devMsg.js";

/**
 * @deprecated `createLocaleRedirect()` has been removed due to performance
 *   issues.
 */
export function createLocaleRedirect() {
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
