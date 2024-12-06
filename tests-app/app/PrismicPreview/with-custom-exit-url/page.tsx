import { PrismicPreview } from "@prismicio/next";

export default function Page() {
	return (
		<div>
			<PrismicPreview
				repositoryName="foobar"
				exitPreviewURL="/api/custom-exit-preview"
			/>
			<span data-testid="timestamp">timestamp: {Date.now()}</span>
		</div>
	);
}
