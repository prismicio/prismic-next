import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { PrismicPreview } from "@prismicio/next/pages";

import { createClient, repositoryName } from "@/prismicio";

export default function Page({
	page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
	return (
		<>
			<div data-testid="payload">{page.data.payload}</div>
			<PrismicPreview repositoryName={repositoryName} />
		</>
	);
}

export async function getStaticProps({
	params,
	previewData,
}: GetStaticPropsContext<{ uid: string }>) {
	const client = createClient({ previewData });
	const page = await client.getByUID("page", params!.uid);

	return { props: { page } };
}

export async function getStaticPaths() {
	const client = createClient();
	const pages = await client.getAllByType("page");

	return {
		paths: pages.map((page) => ({ params: { uid: page.uid } })),
		fallback: "blocking",
	};
}
