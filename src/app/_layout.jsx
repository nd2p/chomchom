import '../i18n';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import { SettingsProvider } from '../features/settings/store';
import { useSettings } from '../features/settings/hooks';
import { AuthProvider } from '../features/auth/store';
import { useAuth } from '../features/auth/hooks';

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const { theme, colors } = useSettings();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, router, segments]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <SettingsProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </SettingsProvider>
    </I18nextProvider>
  );
}
