import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/features/auth/store';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
