/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type * as prismicT from "@prismicio/types";
import * as prismicH from "@prismicio/helpers";
import { PrismicText, PrismicRichText } from "@prismicio/react";

import { createClient, linkResolver } from "../prismicio";

type PageDocument = prismicT.PrismicDocumentWithUID<{
	title: prismicT.RichTextField;
	description: prismicT.RichTextField;
}>;

type HomeProps = {
	page: PageDocument;
};

type HomeParams = {
	path: string[];
};

const Home: NextPage<HomeProps> = ({ page }) => {
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
		.map((page) => prismicH.asLink(page, linkResolver))
		.filter((path): path is NonNullable<typeof path> => Boolean(path));

	return {
		paths,
		fallback: false,
	};
};
