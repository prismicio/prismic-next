import { NotFoundError } from "@prismicio/client";
import { PrismicPreview } from "@prismicio/next";
import { notFound } from "next/navigation";

import { createClient, repositoryName } from "@/prismicio";

export default async function Page({
	params,
}: {
	params: Promise<{ uid: string }>;
}) {
	const { uid } = await params;

	const client = createClient();
	const page = await client.getByUID("page", uid).catch((error) => {
		if (error instanceof NotFoundError) {
			console.log(error.url);
			notFound();
		}
		throw error;
	});

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
