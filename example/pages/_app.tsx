import "../styles/globals.css";
import type { AppProps } from "next/app";
import { PrismicPreview } from "@prismicio/next";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<PrismicPreview repositoryName="smashing-mag-nick-1">
			<Component {...pageProps} />;
		</PrismicPreview>
	);
}

export default MyApp;
