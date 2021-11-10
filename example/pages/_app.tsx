import { useEffect } from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PrismicPreview } from 'prismic-next';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (window) {
      window.addEventListener('prismicPreviewUpdate', async (event: Event) => {
        console.log('update fires');
        // Prevent the toolbar from reloading the page.
        event.preventDefault();

        const detail = (event as CustomEvent<{ ref: string }>).detail;

        // Update the preview cookie.
        await fetch(`/api/preview?token=${detail.ref}`);

        // Reload the page with the updated token.
        window.location.reload();
      });

      window.addEventListener('prismicPreviewEnd', async (event: Event) => {
        console.log('exit fires');
        fetch('/api/exit-preview');
      });
    }
  }, []);
  return (
    <PrismicPreview repoName='smashing-mag-nick-1'>
      <Component {...pageProps} />;
    </PrismicPreview>
  );
}

export default MyApp;
