import { STORAGE_STATE } from "../playwright.config";
import { test as setup } from "./test";
import * as data from "./data";

setup("create repo", async ({ page, prismic }) => {
	const cookies = await page.context().cookies();
	const repositoryName = cookies.find(
		(cookie) => cookie.name === "repository-name",
	)?.value;

	if (repositoryName) return;

	const repository = await prismic.createRepository({
		prefix: "prismicio-next",
		defaultLocale: "fr-fr",
	});
	await page.context().addCookies([
		{
			name: "repository-name",
			value: repository.domain,
			domain: "localhost",
			path: "/",
		},
	]);
	await page.context().storageState({ path: STORAGE_STATE });

	await repository.addCustomType(data.page.model);
	const pageDocument = await repository.createDocument({
		custom_type_id: data.page.model.id,
		title: data.page.model.label,
		tags: [],
		integration_field_ids: [],
		data: data.page.content({ uid: "published" }),
	});
	await repository.publishDocument(pageDocument.id);
	await repository.createDocument({
		custom_type_id: data.page.model.id,
		title: data.page.model.label,
		tags: [],
		integration_field_ids: [],
		data: data.page.content({ uid: "unpublished" }),
	});

	await repository.addCustomType(data.link.model);
	const linkDocument = await repository.createDocument({
		custom_type_id: data.link.model.id,
		title: data.link.model.label,
		tags: [],
		integration_field_ids: [],
		data: data.link.content({
			documentLinkID: pageDocument.id,
		}),
	});
	await repository.publishDocument(linkDocument.id);

	await repository.addCustomType(data.image.model);
	const imageDocument = await repository.createDocument({
		custom_type_id: data.image.model.id,
		title: data.image.model.label,
		tags: [],
		integration_field_ids: [],
		data: data.image.content(),
	});
	await repository.publishDocument(imageDocument.id);
});
