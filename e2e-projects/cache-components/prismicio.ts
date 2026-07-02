import { readFileSync } from "node:fs"
import { join } from "node:path"

import * as prismic from "@prismicio/client"

// The e2e harness provisions an ephemeral repository per run and records its
// name in Playwright's storage state. Reading it from disk — rather than a
// per-request cookie — lets pages be statically generated, matching a typical
// Prismic site.
function getRepositoryName(): string {
	const path = join(process.cwd(), "..", "..", "tests", "infra", ".storage-state.json")
	const storageState: { cookies: { name: string; value: string }[] } = JSON.parse(
		readFileSync(path, "utf8"),
	)
	const cookie = storageState.cookies.find((c) => c.name === "repository-name")
	if (!cookie) {
		throw new Error("Missing repository-name in Playwright storage state.")
	}
	return cookie.value
}

export function createClient(): prismic.Client {
	return prismic.createClient(getRepositoryName(), {
		routes: [{ type: "page", path: "/:uid" }],
	})
}
