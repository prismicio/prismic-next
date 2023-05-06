import type { GetStaticPaths, GetStaticProps } from "next";
import * as prismic from "@prismicio/client";
import { PrismicText, PrismicRichText } from "@prismicio/react";

import { createClient, linkResolver } from "../prismicio";

type PageDocument = prismic.PrismicDocumentWithUID<{
	title: prismic.RichTextField;
	description: prismic.RichTextField;
}>;

type HomeProps = {
	page: PageDocument;
};

type HomeParams = {
	path: string[];
};

const Home = ({ page }: HomeProps) => {
	return (
		<div>
			<h1>
				<PrismicText field={page.data.title} />
			</h1>
			<div>
				<PrismicRichText field={page.data.description} />
			</div>
			<hr />
			<p>The raw page:</p>
			<pre>
				<code>{JSON.stringify(page, null, 4)}</code>
			</pre>
		</div>
	);
};

export default Home;

export const getStaticProps: GetStaticProps<HomeProps, HomeParams> = async ({
	params,
	previewData,
}) => {
	const client = createClient({ previewData });

	const uid = params?.path?.[params.path?.length - 1] || "home";
	const page = await client.getByUID<PageDocument>("page", uid);

	return {
		props: {
			page,
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const client = createClient();

	const pages = await client.getAllByType<PageDocument>("page");
	const paths = pages
		.map((page) => prismic.asLink(page, linkResolver))
		.filter((path): path is NonNullable<typeof path> => Boolean(path));

	return {
		paths,
		fallback: false,
	};
};
