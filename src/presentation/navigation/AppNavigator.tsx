import React, {PropsWithChildren} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSessionStore} from '@/presentation/state';

const RootStack = createNativeStackNavigator();

const AuthLayout: React.FC<PropsWithChildren> = ({children}) => (
  <View style={styles.screenContainer}>{children}</View>
);

const ClientLayout: React.FC<PropsWithChildren> = ({children}) => (
  <View style={styles.screenContainer}>{children}</View>
);

const AdminLayout: React.FC<PropsWithChildren> = ({children}) => (
  <View style={styles.screenContainer}>{children}</View>
);

const SplashScreen: React.FC = () => (
  <View style={styles.center}>
    <ActivityIndicator size="large" />
  </View>
);

const AuthPlaceholderScreen: React.FC = () => (
  <AuthLayout>
    <View style={styles.center} />
  </AuthLayout>
);

const ClientPlaceholderScreen: React.FC = () => (
  <ClientLayout>
    <View style={styles.center} />
  </ClientLayout>
);

const AdminPlaceholderScreen: React.FC = () => (
  <AdminLayout>
    <View style={styles.center} />
  </AdminLayout>
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
          <RootStack.Screen name="Auth" component={AuthPlaceholderScreen} />
        ) : user.role === 'ADMIN' ? (
          <RootStack.Screen name="Admin" component={AdminPlaceholderScreen} />
        ) : (
          <RootStack.Screen name="Client" component={ClientPlaceholderScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
