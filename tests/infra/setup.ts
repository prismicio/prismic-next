import { STORAGE_STATE } from "../../playwright.config";
import { test as setup } from "./test";
import * as content from "./content";

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

	await repository.addCustomType(content.page.model);
	const pageDocument = await repository.createDocument({
		custom_type_id: content.page.model.id,
		title: content.page.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.page.content({ uid: "published" }),
	});
	await repository.publishDocument(pageDocument.id);
	await repository.createDocument({
		custom_type_id: content.page.model.id,
		title: content.page.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.page.content({ uid: "unpublished" }),
	});

	await repository.addCustomType(content.link.model);
	const linkDocument = await repository.createDocument({
		custom_type_id: content.link.model.id,
		title: content.link.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.link.content({
			documentLinkID: pageDocument.id,
		}),
	});
	await repository.publishDocument(linkDocument.id);

	await repository.addCustomType(content.image.model);
	const imageDocument = await repository.createDocument({
		custom_type_id: content.image.model.id,
		title: content.image.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.image.content(),
	});
	await repository.publishDocument(imageDocument.id);

	await repository.addCustomType(content.richtext.model);
	const richtextDocument = await repository.createDocument({
		custom_type_id: content.richtext.model.id,
		title: content.richtext.model.label,
		tags: [],
		integration_field_ids: [],
		data: content.richtext.content(),
	});
	await repository.publishDocument(richtextDocument.id);
});
