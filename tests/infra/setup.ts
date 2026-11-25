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
	const https = await import("node:https")
	const url = "https://static.cdn.prismic.io/prismic-toolbar/79d8e5e5/v5.js"
	const ips = (await dns.lookup("static.cdn.prismic.io", { all: true, family: 4 })).map(
		(a) => a.address,
	)
	const origins = ["", "http://localhost:4321", "http://localhost:4322", "https://example.com"]
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
					"[diag] setup edge",
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
					`via=${h.via}`,
				)
			}
})
