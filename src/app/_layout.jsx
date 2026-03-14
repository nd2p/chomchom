import '../i18n';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SettingsProvider } from '../features/settings/store';
import { useSettings } from '../features/settings/hooks';
import { AuthProvider } from '../features/auth/store';
import { useAuth } from '../features/auth/hooks';

function RootLayoutNav() {
  const { isAuthenticated, isRestoring } = useAuth();
  const { theme, colors } = useSettings();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isRestoring) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isRestoring, router, segments]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </SettingsProvider>
  );
}
