import { spawn } from "node:child_process"
import type { ChildProcess } from "node:child_process"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { expect, test } from "@playwright/test"
import lzString from "lz-string"

const ROOT = fileURLToPath(new URL("..", import.meta.url))

// In production, the simulator only accepts messages from Prismic origins.
const EDITOR_URL = "https://slice-simulator-e2e.prismic.io"

const PROJECTS = [
	{ name: "app-router", port: 4324 }, // Next.js 16
	{ name: "next-15", port: 4325 },
	{ name: "next-14", port: 4326 },
]

// Lets the public editor origin embed the simulator from localhost.
test.use({ permissions: ["local-network-access"] })

for (const { name, port } of PROJECTS) {
	test.describe.serial(name, () => {
		const simulatorURL = `http://localhost:${port}/slice-simulator`
		let server: ChildProcess

		test.beforeAll(async () => {
			server = spawn("npx", ["next", "start", "--port", String(port)], {
				cwd: join(ROOT, "e2e-projects", name),
				detached: true,
				stdio: ["ignore", "ignore", "inherit"],
			})
			await expect(async () => {
				expect((await fetch(simulatorURL)).ok).toBe(true)
			}).toPass()
		})

		test.afterAll(() => {
			if (server.pid) process.kill(-server.pid)
		})

		test("renders slices sent by Prismic, not slices from the URL", async ({ page }) => {
			const state = lzString.compressToEncodedURIComponent(
				JSON.stringify([{ id: "1", slice_type: "from_the_url" }]),
			)
			await page.route(`${EDITOR_URL}/**`, async (route) => {
				const { pathname } = new URL(route.request().url())
				if (pathname === "/") {
					await route.fulfill({
						contentType: "text/html",
						body: editorHTML(`${simulatorURL}?state=${state}`),
					})
				} else {
					await route.fulfill({
						path: join(ROOT, "node_modules/@prismicio/simulator/dist", pathname),
					})
				}
			})
			await page.goto(EDITOR_URL)
			const simulator = page.frameLocator("iframe")

			// The simulator connects after hydration, by which point slices from the URL would render.
			await expect(page.getByText("Connected")).toBeVisible()
			await expect(simulator.getByText("from_the_url")).toHaveCount(0)

			await page.getByRole("button", { name: "Send slices" }).click()
			await expect(simulator.getByText("from_prismic")).toBeVisible()
		})
	})
}

/** A page that connects to the simulator like Slice Machine and the Page Builder do. */
function editorHTML(simulatorURL: string): string {
	return /* html */ `
		<button>Send slices</button>
		<script type="module">
			import { SimulatorClient } from "/index.js"

			const iframe = document.createElement("iframe")
			const client = new SimulatorClient(iframe)
			const connected = client.connect()
			iframe.src = ${JSON.stringify(simulatorURL)}
			document.body.append(iframe)
			await connected
			document.body.append("Connected")

			document.querySelector("button").onclick = () => {
				client.setSliceZone([{ id: "2", slice_type: "from_prismic" }])
			}
		</script>
	`
}
