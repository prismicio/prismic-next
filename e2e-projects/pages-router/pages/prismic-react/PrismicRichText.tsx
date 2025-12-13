import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { isFilled } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import assert from "assert";

import "@prismicio/next/pages";

import { createClient } from "@/prismicio";

export default function Page({
	tests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<div data-testid="internal-uses-next-link">
				<PrismicRichText field={tests.hyperlink_internal} />
			</div>

			<div data-testid="external-uses-default">
				<PrismicRichText field={tests.hyperlink_external} />
			</div>
		</>
	);
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
	const repositoryName = req.cookies["repository-name"];
	assert(
		repositoryName && typeof repositoryName === "string",
		"A repository-name cookie is required.",
	);

	const client = createClient(repositoryName);
	const { data: tests } = await client.getSingle("rich_text_test");

	assert(isFilled.richText(tests.hyperlink_internal));
	assert(isFilled.richText(tests.hyperlink_external));

	return { props: { tests } };
}
