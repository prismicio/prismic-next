import assert from "assert"

import type { FrameLocator, Locator, Page } from "@playwright/test"
import { test as base, expect } from "@playwright/test"
import { createClient } from "@prismicio/client"

/* oxlint-disable rules-of-hooks */
import type { CoreAPIDocument, Repo } from "./client"
import { Prismic } from "./client"

type Fixtures = {
	prismic: Prismic
	repo: Repo
	linkDoc: CoreAPIDocument
	imageDoc: CoreAPIDocument
	pageDoc: CoreAPIDocument
	unpublishedPageDoc: CoreAPIDocument
	masterRef: string
	embed: (src: string) => Promise<FrameLocator>
	appPage: AppPage
}

const PREVIEW_TOOLBAR_TIMEOUT = 30_000

export const test = base.extend<Fixtures>({
	prismic: async ({ page }, use) => {
		assert(process.env.E2E_PRISMIC_EMAIL, "Missing E2E_PRISMIC_EMAIL env variable.")
		assert(process.env.E2E_PRISMIC_PASSWORD, "Missing E2E_PRISMIC_PASSWORD env variable.")
		const prismic = new Prismic({
			baseURL: "https://prismic.io",
			auth: {
				email: process.env.E2E_PRISMIC_EMAIL,
				password: process.env.E2E_PRISMIC_PASSWORD,
			},
			request: page.request,
		})
		await use(prismic)
	},
	repo: async ({ page, prismic, baseURL }, use) => {
		assert(baseURL, "A baseURL must be configured to test Prismic previews.")
		const cookies = await page.context().cookies()
		const repoName = cookies.find((c) => c.name === "repository-name")?.value
		assert(repoName, "Missing repository-name cookie. Run the setup project.")
		const repo = prismic.getRepo(repoName)
		const url = new URL("api/preview", baseURL)
		await repo.createPreview({ name: url.toString(), url })
		await use(repo)
	},
	pageDoc: async ({ repo }, use) => {
		const document = await repo.getDocumentByUID("page", "published")
		await use(document)
	},
	unpublishedPageDoc: async ({ repo }, use) => {
		const document = await repo.getDocumentByUID("page", "unpublished")
		await use(document)
	},
	masterRef: async ({ repo }, use) => {
		const client = createClient(new URL("/api/v2", repo.urls.cdn).toString())
		const { ref } = await client.getMasterRef()
		await use(ref)
	},
	embed: async ({ page, baseURL }, use) => {
		const parentURL = new URL("/iframe", baseURL)
		parentURL.hostname = "127.0.0.1"
		// Chromium treats `page.route` responses as public, so the frame needs this to reach loopback.
		await page.context().grantPermissions(["local-network-access"], { origin: parentURL.origin })
		await use(async (src) => {
			await page.route(parentURL.href, (route) =>
				route.fulfill({ contentType: "text/html", body: `<iframe src="${src}">` }),
			)
			await page.goto(parentURL.href)
			return page.frameLocator("iframe")
		})
	},
	appPage: async ({ page, repo }, use, testInfo) => {
		const tag = `[diag] ${testInfo.project.name} › ${testInfo.title} #${testInfo.retry}`
		page.on("request", (req) => {
			if (req.url().includes("static.cdn.prismic.io"))
				console.info(tag, "request", req.url(), JSON.stringify(req.headers()))
		})
		page.on("response", async (res) => {
			if (!res.url().includes("static.cdn.prismic.io")) return
			const addr = await res.serverAddr().catch(() => null)
			console.log(
				tag,
				"response",
				res.status(),
				res.url(),
				JSON.stringify(addr),
				res.fromServiceWorker(),
				JSON.stringify(await res.allHeaders()),
			)
		})
		page.on("framenavigated", (frame) => {
			if (frame === page.mainFrame()) console.info(tag, "navigated", frame.url())
		})
		page.on("requestfailed", (req) => {
			console.info(tag, "requestfailed", req.url(), req.failure()?.errorText)
		})
		page.on("console", (msg) => {
			if (msg.type() === "error" || msg.type() === "warning")
				console.info(tag, "console", msg.type(), msg.text().replace(/\s+/g, " ").slice(0, 400))
			if (!msg.text().includes("Could not load the preview")) return
			const url = "https://static.cdn.prismic.io/prismic-toolbar/79d8e5e5/v5.js"
			page
				.evaluate(async (url) => {
					const out: string[] = [location.href]
					for (const init of [{ mode: "cors" }, { mode: "no-cors" }] as RequestInit[]) {
						try {
							const r = await fetch(url, { ...init, cache: "no-store" })
							out.push(
								`${init.mode} ${r.status} ${r.type} acao=${r.headers.get("access-control-allow-origin")}`,
							)
						} catch (e) {
							out.push(`${init.mode} threw ${String(e)}`)
						}
					}
					try {
						await import(/* webpackIgnore: true */ url + "?retry=" + Date.now())
						out.push("re-import ok")
					} catch (e) {
						out.push(`re-import threw ${String(e)}`)
					}
					return out
				}, url)
				.then((out) => console.info(tag, "probe", JSON.stringify(out)))
				.catch((e) => console.info(tag, "probe failed", String(e)))
			void (async () => {
				const dns = await import("node:dns/promises")
				const https = await import("node:https")
				const ips = (await dns.lookup("static.cdn.prismic.io", { all: true, family: 4 })).map(
					(a) => a.address,
				)
				const origins = [
					"",
					"http://localhost:4321",
					"http://localhost:4322",
					"https://example.com",
				]
				const encodings = ["", "gzip", "br", "gzip, deflate, br, zstd"]
				for (const ip of ips)
					for (const origin of origins)
						for (const encoding of encodings) {
							const h = await new Promise<Record<string, unknown>>((resolve) => {
								const req = https.get(
									url,
									{
										headers: {
											...(origin && { origin }),
											...(encoding && { "accept-encoding": encoding }),
										},
										lookup: (_h, _o, cb) => cb(null, [{ address: ip, family: 4 }]),
									},
									(res) => {
										res.resume()
										resolve({ status: res.statusCode, ...res.headers })
									},
								)
								req.on("error", (e) => resolve({ error: String(e) }))
							})
							console.info(
								tag,
								"edge",
								ip,
								`origin=${origin || "none"}`,
								`ae=${encoding || "none"}`,
								h.status ?? h.error,
								`acao=${h["access-control-allow-origin"]}`,
								`ce=${h["content-encoding"]}`,
								`age=${h.age}`,
								`xcache=${h["x-cache"]}`,
								`pop=${h["x-amz-cf-pop"]}`,
								`vary=${h.vary}`,
							)
						}
			})().catch((e) => console.info(tag, "edge failed", String(e)))
		})
		const appPage = new AppPage(page, repo)
		await use(appPage)
	},
})

class AppPage {
	page: Page
	repository: Repo
	toolbarScript: Locator
	toolbar: Locator
	payload: Locator

	constructor(page: Page, repository: Repo) {
		this.page = page
		this.repository = repository
		this.toolbarScript = page.locator('script[src*="prismic.io/prismic.js"]')
		this.toolbar = page.getByRole("region", { name: "Prismic preview" })
		this.payload = page.getByTestId("payload")
	}

	async goToDocument(document: CoreAPIDocument, pathPrefix = "") {
		const client = createClient(new URL("/api/v2", this.repository.urls.cdn).toString(), {
			routes: [{ type: "page", path: "/:uid" }],
		})
		const apiDocument = await client.getByID(document.id)
		return await this.page.goto(pathPrefix + apiDocument.url!)
	}

	async preview(document: CoreAPIDocument) {
		const previewSession = await this.repository.createPreviewSession(document)
		// The editor adds the session for websites that opt into the toolbar's v5.
		await this.page.goto(`${previewSession.preview_url}&session=${previewSession.session_id}`)
		return previewSession
	}

	/** Opens a share link, which goes through the app's preview route to `path`. */
	async share(document: CoreAPIDocument, path: string) {
		const { preview_url, session_id } = await this.repository.createPreviewSession(document)
		const token = new URL(preview_url).searchParams.get("token")!
		await this.page.goto(
			`/api/preview?${new URLSearchParams({ token, session: session_id, path })}`,
		)
	}

	async waitForToolbar() {
		await expect(this.toolbar).toHaveCount(1, {
			timeout: PREVIEW_TOOLBAR_TIMEOUT,
		})
	}

	async exitPreview() {
		await this.waitForToolbar()
		await this.toolbar.getByRole("button", { name: "Exit preview" }).click()
		await expect(this.toolbar).toHaveCount(0, {
			timeout: PREVIEW_TOOLBAR_TIMEOUT,
		})
	}

	async getToolbarScriptParam(name: string) {
		const src = await this.toolbarScript.getAttribute("src")
		return new URL(src ?? "").searchParams.get(name)
	}
}
