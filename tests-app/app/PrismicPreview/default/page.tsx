import { PrismicPreview } from "@prismicio/next";
import { draftMode } from "next/headers";

export default async function Page() {
	const { isEnabled } = await draftMode();

	return (
		<div>
			<PrismicPreview repositoryName="foobar" />
			<span data-testid="timestamp">timestamp: {Date.now()}</span>
			<span data-testid="draft-mode">{isEnabled.toString()}</span>
		</div>
	);
}
