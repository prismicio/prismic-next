import { isFilled } from "@prismicio/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { PrismicNextRichText } from "@prismicio/next/pages";
import assert from "assert";

import { createClient } from "@/prismicio";

export default function Page({
	tests,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	assert(!isFilled.richText(tests.empty));
	assert(isFilled.richText(tests.with_image));
	assert(isFilled.richText(tests.with_link));
	assert(isFilled.richText(tests.with_linked_image));

	return (
		<>
			<div data-testid="empty">
				<PrismicNextRichText field={tests.empty} />
			</div>
			<div data-testid="image">
				<div data-testid="default">
					<PrismicNextRichText field={tests.with_image} />
				</div>
				<div data-testid="custom">
					<PrismicNextRichText
						field={tests.with_image}
						components={{
							image: ({ node }) => (
								<img data-custom="true" src={node.url} alt="" />
							),
						}}
					/>
				</div>
				<div data-testid="with-link">
					<PrismicNextRichText field={tests.with_linked_image} />
				</div>
			</div>
			<div data-testid="hyperlink">
				<div data-testid="default">
					<PrismicNextRichText field={tests.with_link} />
				</div>
				<div data-testid="custom">
					<PrismicNextRichText
						field={tests.with_link}
						components={{
							hyperlink: ({ node, children }) => (
								<a data-custom="true" href={node.data.url}>
									{children}
								</a>
							),
						}}
					/>
				</div>
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

	return { props: { tests } };
}
