/**
 * Resolves a module's default export. The module may provide its default export
 * as a `default` property on an object. This happens when named and default
 * exports are mixed in modules.
 *
 * In ES Modules, mixing is fine since the module resolver can distinguish
 * default and named exports. In transpiled modules, however, all exports are
 * put into a single object, and the default export is provided at a property
 * called `default`.
 *
 * This helper is needed by Next.js uses CJS files with named and default
 * exports.
 *
 * This helper _should_ be a temporary hack until Next.js and Node.js resolve
 * their ESM difficulties. This will likely not be removed any time soon,
 * unfortunately.
 */
export function resolveDefaultExport<T>(mod: T): T {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return "default" in (mod as any) ? (mod as any).default : mod;
}
