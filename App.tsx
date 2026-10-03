import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './src/features/cart/context/CartContext';
import { ActivityProvider } from './src/features/catalog/context/ActivityContext';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AppSplashScreen } from './src/components/ui/AppSplashScreen';
import { InitialPreferencesModal } from './src/components/ui/InitialPreferencesModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <CurrencyProvider>
            <CartProvider>
              <ActivityProvider>
                <StatusBar style="dark" />
                <RootNavigator />
                <InitialPreferencesModal />
                <AppSplashScreen minDurationMs={1500} />
              </ActivityProvider>
            </CartProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
