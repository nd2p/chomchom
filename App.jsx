import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/features/auth/store';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <AppNavigator />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
