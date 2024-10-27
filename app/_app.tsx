// app/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Provider } from './provider';
import { CartProvider } from '../context/page'; // Ensure the path is correct

const inter = Inter({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>E-commerce Page</title>
        <meta name="description" content="Modern e-commerce website" />
        {/* Add other meta tags as needed */}
      </Head>
      <Provider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </Provider>
    </>
  );
}

export default MyApp;
