import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react';
import { GridContextProvider } from '@/context/GridContext';

export default function App({ Component, pageProps }: AppProps) {
  return <GridContextProvider>
    <Component {...pageProps} />
    <Analytics />
  </GridContextProvider>
}
