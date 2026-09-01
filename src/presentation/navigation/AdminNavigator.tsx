import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AdminReservationsScreen} from '@/presentation/screens/admin';

export type AdminStackParamList = {
  ReservationsList: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export const AdminNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="ReservationsList" component={AdminReservationsScreen} />
  </Stack.Navigator>
);
