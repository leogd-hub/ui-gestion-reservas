import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from '@/presentation/navigation';

export const AppEntry: React.FC = () => (
  <SafeAreaProvider>
    <AppNavigator />
  </SafeAreaProvider>
);
