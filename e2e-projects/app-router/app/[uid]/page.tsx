import type { JSX } from "react";
import { PrismicPreview } from "@prismicio/next";

import { createClient } from "@/prismicio";

export default async function Page({
	params,
}: {
	params: Promise<{ uid: string }>;
}): Promise<JSX.Element> {
	const { uid } = await params;

	const client = await createClient();
	const page = await client.getByUID("page", uid);

	return (
		<>
			<div data-testid="payload">{page.data.payload}</div>
			<PrismicPreview repositoryName={client.repositoryName} />
		</>
	);
}
