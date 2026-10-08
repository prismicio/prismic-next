import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { expect, test } from "@playwright/test"

const ROOT = fileURLToPath(new URL("..", import.meta.url))

// Returns stdout and stderr together: Next.js prints webpack warnings to stderr.
function run(file: string, args: string[], cwd: string) {
	const { status, stdout, stderr } = spawnSync(file, args, { cwd, encoding: "utf8" })
	if (status !== 0) {
		throw new Error(`\`${[file, ...args].join(" ")}\` failed:\n${stderr}`)
	}
	return stdout + stderr
}

for (const name of ["app-router", "pages-router", "next-14", "next-15"]) {
	test.describe.serial(name, () => {
		const project = join(ROOT, "e2e-projects", name)

		test("builds", () => {
			if (name === "next-14" || name === "next-15") {
				// Install the package like a consumer. A workspace symlink would resolve `next/*` from
				// the root `node_modules`, which is Next 16.
				const dir = mkdtempSync(join(tmpdir(), "prismic-next-"))
				run("npm", ["pack", "--silent", "--ignore-scripts", "--pack-destination", dir], ROOT)
				const [tarball] = readdirSync(dir)
				const flags = ["--silent", "--no-save", "--no-package-lock", "--no-audit", "--no-fund"]
				run("npm", ["install", ...flags, join(dir, tarball)], project)
			}
			// The build cache treats `node_modules` as unchanged while the package version is the same.
			rmSync(join(project, ".next/cache"), { recursive: true, force: true })
			const output = run("npx", ["next", "build"], project)
			// Webpack reports a missing export as a warning, and the build still succeeds.
			expect(output).not.toContain("Attempted import error")
		})

		test("tree-shakes unused exports", () => {
			const dir = join(project, ".next/static/chunks")
			const js = readdirSync(dir, { recursive: true, encoding: "utf8" })
				.filter((file) => file.endsWith(".js"))
				.map((file) => readFileSync(join(dir, file), "utf8"))
				.join("\n")
			// No `@prismicio/next` export reaches the Prismic Write API. Its URLs appear only when
			// the package was not tree-shaken.
			expect(js).not.toContain("https://asset-api.prismic.io")
			expect(js).not.toContain("https://migration.prismic.io")
		})
	})
}
