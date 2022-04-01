import type { AppProps } from "next/app";
import { PrismicPreview } from "@prismicio/next";

import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
	return (
		<PrismicPreview repositoryName="smashing-mag-nick-1">
			<Component {...pageProps} />;
		</PrismicPreview>
	);
}
