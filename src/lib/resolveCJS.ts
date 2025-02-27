/**
 * Resolves a CommonJS import that might have a `default` property. This happens
 * when named and default exports are mixed in modules. Next.js seems to do this
 * in the exact set up `@prismicio/next` uses.
 *
 * This is _should_ be a temporary hack until Next.js and Node.js resolve their
 * ESM difficulties. This will likely not be removed any time soon.
 */
export function resolveCJS<T>(mod: T): T {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return "default" in (mod as any) ? (mod as any).default : mod;
}
