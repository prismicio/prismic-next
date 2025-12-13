import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { isFilled } from "@prismicio/client";
import { PrismicLink } from "@prismicio/react";
import assert from "assert";

import "@prismicio/next/pages";

import { createClient } from "@/prismicio";

export default function Page({
	tests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<PrismicLink
				field={tests.internal_web}
				data-testid="internal-uses-next-link"
			>
				Link
			</PrismicLink>

			<PrismicLink
				field={tests.external_web}
				data-testid="external-uses-default"
			>
				Link
			</PrismicLink>
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
	const { data: tests } = await client.getSingle("link_test");

	assert(isFilled.link(tests.internal_web));
	assert(isFilled.link(tests.external_web));

	return { props: { tests } };
}
