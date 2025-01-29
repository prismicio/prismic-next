import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { PrismicPreview } from "@prismicio/next/pages";
import assert from "node:assert";

import { createClient } from "@/prismicio";

export default function Page({
	repositoryName,
	page,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<div data-testid="payload">{page.data.payload}</div>
			<PrismicPreview
				repositoryName={repositoryName}
				updatePreviewURL="/api/custom-preview"
				exitPreviewURL="/api/custom-exit-preview"
			/>
		</>
	);
}

export async function getServerSideProps({
	req,
	params,
	previewData,
}: GetServerSidePropsContext<{ uid: string }>) {
	const repositoryName = req.cookies["repository-name"];
	assert(
		repositoryName && typeof repositoryName === "string",
		"A repository-name cookie is required.",
	);

	const client = createClient(repositoryName, { previewData });
	const page = await client.getByUID("page", params!.uid);

	return { props: { repositoryName, page } };
}
