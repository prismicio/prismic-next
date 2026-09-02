import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { expect, test } from "@playwright/test"

const ROOT = fileURLToPath(new URL("..", import.meta.url))

/**
 * Strings from code that no `@prismicio/next` export reaches (the Prismic Write API). When they
 * appear in a client bundle, the package was not tree-shaken.
 */
const UNREACHABLE = ["https://asset-api.prismic.io", "https://migration.prismic.io"]

function run(file: string, args: string[], cwd: string): string {
	return execFileSync(file, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] })
}

function build(project: string): void {
	// The build cache treats `node_modules` as unchanged while the package version is the same.
	rmSync(join(project, ".next/cache"), { recursive: true, force: true })
	run("npx", ["next", "build"], project)
}

function clientJS(project: string): string {
	const dir = join(project, ".next/static/chunks")
	return readdirSync(dir, { recursive: true, encoding: "utf8" })
		.filter((file) => file.endsWith(".js"))
		.map((file) => readFileSync(join(dir, file), "utf8"))
		.join("\n")
}

for (const name of ["app-router", "pages-router"]) {
	test.describe.serial(`${name} (Next 16)`, () => {
		const project = join(ROOT, "e2e-projects", name)

		test("builds", () => {
			build(project)
		})

		test("tree-shakes unused exports", () => {
			test.fail(true, "https://github.com/prismicio/prismic-next/issues/142")
			const js = clientJS(project)
			for (const string of UNREACHABLE) expect(js).not.toContain(string)
		})
	})
}

test.describe.serial("next-15", () => {
	const project = join(ROOT, "e2e-projects/next-15")

	test("builds", () => {
		// Install the package like a consumer. A workspace symlink would resolve `next/*` from the
		// root `node_modules`, which is Next 16.
		const dir = mkdtempSync(join(tmpdir(), "prismic-next-"))
		const tarball = run(
			"npm",
			["pack", "--silent", "--ignore-scripts", "--pack-destination", dir],
			ROOT,
		)
		const flags = ["--silent", "--no-save", "--no-package-lock", "--no-audit", "--no-fund"]
		run("npm", ["install", ...flags, join(dir, tarball.trim())], project)
		build(project)
	})

	test("tree-shakes unused exports", () => {
		test.fail(true, "https://github.com/prismicio/prismic-next/issues/142")
		const js = clientJS(project)
		for (const string of UNREACHABLE) expect(js).not.toContain(string)
	})
})
