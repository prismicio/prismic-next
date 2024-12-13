import { test as setup } from "./test";
import * as data from "./data";
import { STORAGE_STATE } from "../playwright.config";

setup("create repo", async ({ page, repositoriesManager }) => {
	const cookies = await page.context().cookies();
	const repositoryName = cookies.find(
		(cookie) => cookie.name === "repository-name",
	)?.value;

	if (repositoryName) return;

	const repository = await repositoriesManager.createRepository({
		prefix: "prismicio-next",
		defaultLocale: "fr-fr",
		customTypes: [data.page.model, data.link.model, data.image.model],
	});
	await page.context().addCookies([
		{
			name: "repository-name",
			value: repository.name,
			domain: "localhost",
			path: "/",
		},
	]);
	await page.context().storageState({ path: STORAGE_STATE });

	const pageDocument = await repository.createDocument(
		{
			custom_type_id: data.page.model.id,
			title: data.page.model.label,
			tags: [],
			integration_field_ids: [],
			data: data.page.content("published"),
		},
		"published",
	);
	await repository.createDocument(
		{
			custom_type_id: data.page.model.id,
			title: data.page.model.label,
			tags: [],
			integration_field_ids: [],
			data: data.page.content("unpublished"),
		},
		"draft",
	);

	await repository.createDocument(
		{
			custom_type_id: data.link.model.id,
			title: data.link.model.label,
			tags: [],
			integration_field_ids: [],
			data: data.link.content({
				documentLinkID: pageDocument.id,
			}),
		},
		"published",
	);
	await repository.createDocument(
		{
			custom_type_id: data.image.model.id,
			title: data.image.model.label,
			tags: [],
			integration_field_ids: [],
			data: data.image.content(),
		},
		"published",
	);
});
