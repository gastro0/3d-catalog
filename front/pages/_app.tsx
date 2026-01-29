import * as React from 'react';
import '../styles/globals.css';
import '../styles/auth-modal.css';
import type { AppProps } from 'next/app';
import { ThemeProviderCustom } from '../components/ThemeContext';
import { LangProvider } from '../components/LangContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LangProvider>
      <ThemeProviderCustom>
        <Component {...pageProps} />
      </ThemeProviderCustom>
    </LangProvider>
  );
}

