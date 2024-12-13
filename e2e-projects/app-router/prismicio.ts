import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import { cookies } from "next/headers";
import assert from "node:assert";

export async function createClient(config: prismic.ClientConfig = {}) {
	const cookieJar = await cookies();
	const repositoryName = cookieJar.get("repository-name")?.value;
	assert(repositoryName, "A repository-name cookie is required.");

	const client = prismic.createClient(repositoryName, {
		fetchOptions: { cache: "no-store" },
		...config,
	});

	prismicNext.enableAutoPreviews({ client });

	return client;
}
