import { STORAGE_STATE } from "../../playwright.config"
import * as content from "./content"
import { test as setup } from "./test"

setup("create repo", async ({ page, prismic }) => {
	const cookies = await page.context().cookies()
	const repositoryName = cookies.find((cookie) => cookie.name === "repository-name")?.value

	if (repositoryName) return

	const repository = await prismic.createRepository({
		prefix: "prismicio-next",
		defaultLocale: "fr-fr",
	})
	await page.context().addCookies([
		{
			name: "repository-name",
			value: repository.domain,
			domain: "localhost",
			path: "/",
			sameSite: "None",
			secure: true,
		},
	])
	await page.context().storageState({ path: STORAGE_STATE })

	await repository.addCustomType(content.page.model)
	const pageDocument = await repository.createDocument({
		custom_type_id: content.page.model.id,
		title: content.page.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.page.content({ uid: "published" }),
	})
	await repository.publishDocument(pageDocument.id)
	await repository.createDocument({
		custom_type_id: content.page.model.id,
		title: content.page.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.page.content({ uid: "unpublished" }),
	})

	await repository.addCustomType(content.link.model)
	const linkDocument = await repository.createDocument({
		custom_type_id: content.link.model.id,
		title: content.link.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.link.content({
			documentLinkID: pageDocument.id,
		}),
	})
	await repository.publishDocument(linkDocument.id)

	await repository.addCustomType(content.image.model)
	const imageDocument = await repository.createDocument({
		custom_type_id: content.image.model.id,
		title: content.image.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.image.content(),
	})
	await repository.publishDocument(imageDocument.id)
})

setup("probe toolbar CDN edges", async () => {
	const dns = await import("node:dns/promises")
	const http2 = await import("node:http2")
	const https = await import("node:https")
	const path = "/prismic-toolbar/79d8e5e5/v5.js"
	const ips = (await dns.lookup("static.cdn.prismic.io", { all: true, family: 4 })).map(
		(a) => a.address,
	)
	const chrome: Record<string, string> = {
		"sec-ch-ua-platform": '"Windows"',
		"user-agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.8127.18 Safari/537.36",
		"sec-ch-ua": '"Chromium";v="158", "Not.A/Brand";v="24", "HeadlessChrome";v="158"',
		"sec-ch-ua-mobile": "?0",
		origin: "http://localhost:4321",
		accept: "*/*",
		"sec-fetch-site": "cross-site",
		"sec-fetch-mode": "cors",
		"sec-fetch-dest": "script",
		"accept-encoding": "gzip, deflate, br, zstd",
		"accept-language": "en-US",
		priority: "u=1",
	}
	const variants: [string, Record<string, string>][] = [["chrome", chrome]]
	for (const name of Object.keys(chrome)) {
		const { [name]: _, ...rest } = chrome
		variants.push([`chrome-${name}`, rest])
	}
	const min = { origin: chrome.origin, "accept-encoding": "br" }
	variants.push(["origin+br", min])
	for (const priority of ["u=0", "u=1", "u=3", "u=5", "u=1, i", "i"])
		variants.push([`origin+br+priority:${priority}`, { ...min, priority }])
	variants.push(["br+priority:u=1 (no origin)", { "accept-encoding": "br", priority: "u=1" }])
	variants.push([
		"origin+gzip+priority:u=1",
		{ ...min, "accept-encoding": "gzip", priority: "u=1" },
	])
	variants.push(["origin+priority:u=1 (no ae)", { origin: chrome.origin, priority: "u=1" }])
	const log = (ip: string, proto: string, name: string, h: Record<string, unknown>) =>
		console.info(
			"[diag] setup edge2",
			ip,
			proto,
			name,
			h[":status"] ?? h.status ?? h.error,
			`acao=${h["access-control-allow-origin"]}`,
			`ce=${h["content-encoding"]}`,
			`age=${h.age}`,
			`xcache=${h["x-cache"]}`,
			`vary=${h.vary}`,
		)
	for (const ip of ips) {
		for (const [name, headers] of variants) {
			const h1 = await new Promise<Record<string, unknown>>((resolve) => {
				const req = https.get(
					`https://static.cdn.prismic.io${path}`,
					{ headers, lookup: (_h, _o, cb) => cb(null, [{ address: ip, family: 4 }]) },
					(res) => {
						res.resume()
						resolve({ status: res.statusCode, ...res.headers })
					},
				)
				req.on("error", (e) => resolve({ error: String(e) }))
			})
			log(ip, "h1", name, h1)
			const h2 = await new Promise<Record<string, unknown>>((resolve) => {
				const session = http2.connect("https://static.cdn.prismic.io", {
					lookup: (_h, o, cb) =>
						(o as { all?: boolean }).all
							? (cb as unknown as (e: null, a: { address: string; family: number }[]) => void)(
									null,
									[{ address: ip, family: 4 }],
								)
							: cb(null, ip, 4),
				})
				session.on("error", (e) => resolve({ error: String(e) }))
				const req = session.request({ ":path": path, ...headers })
				req.on("response", (h) => {
					resolve({ ...h })
					req.close()
					session.close()
				})
				req.on("error", (e) => resolve({ error: String(e) }))
				req.end()
			})
			log(ip, "h2", name, h2)
		}
	}
})
