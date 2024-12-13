import { NotFoundError } from "@prismicio/client";
import { PrismicPreview } from "@prismicio/next";
import { notFound } from "next/navigation";

import { createClient } from "@/prismicio";

type Params = { uid: string };

export default async function Page({ params }: { params: Promise<Params> }) {
	const { uid } = await params;

	const client = await createClient();
	const page = await client.getByUID("page", uid).catch((error) => {
		if (error instanceof NotFoundError) notFound();
		throw error;
	});

	return (
		<>
			<div data-testid="payload">{page.data.payload}</div>
			<PrismicPreview
				repositoryName={client.repositoryName}
				updatePreviewURL="/api/custom-preview"
				exitPreviewURL="/api/custom-exit-preview"
			/>
		</>
	);
}
