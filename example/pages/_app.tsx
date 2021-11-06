import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PreviewProvider } from 'prismic-next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PreviewProvider repoName='smashing-mag-nick-1'>
      <Component {...pageProps} />;
    </PreviewProvider>
  );
}

export default MyApp;
