import type { AppProps } from "next/app";
import { PrismicPreview } from "@prismicio/next";

import { repositoryName } from "../prismicio";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<PrismicPreview repositoryName={repositoryName}>
			<Component {...pageProps} />
		</PrismicPreview>
	);
}

export default MyApp;
