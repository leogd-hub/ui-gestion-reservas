import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ClientReservationsScreen,
  NewReservationScreen,
  PaymentMethodsScreen,
} from '@/presentation/screens/client';

export type ClientStackParamList = {
  ReservationsList: undefined;
  NewReservation: undefined;
  PaymentMethods: undefined;
};

const Stack = createNativeStackNavigator<ClientStackParamList>();

export const ClientNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ReservationsList" component={ClientReservationsScreen} />
    <Stack.Screen
      name="NewReservation"
      component={NewReservationScreen}
      options={{headerShown: true, title: 'Nueva reserva'}}
    />
    <Stack.Screen
      name="PaymentMethods"
      component={PaymentMethodsScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);
