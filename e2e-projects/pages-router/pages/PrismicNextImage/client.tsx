import { useState } from "react";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { PrismicNextImage } from "@prismicio/next/pages";
import { isFilled } from "@prismicio/client";
import assert from "assert";

import { createClient } from "@/prismicio";

export default function Page({
	field,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [ref, setRef] = useState<Element | null>(null);

	return (
		<p>
			<PrismicNextImage ref={setRef} field={field} />
			<span data-testid="ref">tagname: {ref?.tagName}</span>
		</p>
	);
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
	const repositoryName = req.cookies["repository-name"];
	assert(
		repositoryName && typeof repositoryName === "string",
		"A repository-name cookie is required.",
	);

	const client = createClient(repositoryName);
	const { data: tests } = await client.getSingle("image_test");

	assert(isFilled.image(tests.filled));

	return { props: { field: tests.filled } };
}
