import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { PreferencesProvider } from '../providers/PreferencesProvider';
import { AuthProvider } from '../providers/AuthProvider';
import { FavoritesProvider } from '../providers/FavoritesProvider';
import { AuthModal } from '../features/auth/AuthModal';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PreferencesProvider>
      <AuthProvider>
        <FavoritesProvider>
          <Component {...pageProps} />
          <AuthModal />
        </FavoritesProvider>
      </AuthProvider>
    </PreferencesProvider>
  );
}
