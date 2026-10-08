import { PrismicPreview } from "@prismicio/next/pages"

export default function App({ Component, pageProps }) {
	return (
		<PrismicPreview repositoryName="example">
			<Component {...pageProps} />
		</PrismicPreview>
	)
}
