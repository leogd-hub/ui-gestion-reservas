import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSessionStore} from '@/presentation/state';
import {AuthNavigator} from '@/presentation/navigation/AuthNavigator';
import {ClientNavigator} from '@/presentation/navigation/ClientNavigator';
import {AdminNavigator} from '@/presentation/navigation/AdminNavigator';

const RootStack = createNativeStackNavigator();

const SplashScreen: React.FC = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" />
  </View>
);

export const AppNavigator: React.FC = () => {
  const {status, user, loading, bootstrap} = useSessionStore();

  React.useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (loading && status === 'anonymous' && !user) {
    return <SplashScreen />;
  }

  const isAuthed = status === 'authenticated' && !!user;

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthed ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : user.role === 'ADMIN' ? (
          <RootStack.Screen name="Admin" component={AdminNavigator} />
        ) : (
          <RootStack.Screen name="Client" component={ClientNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
