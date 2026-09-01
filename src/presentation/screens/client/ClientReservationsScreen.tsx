import React from 'react';
import {FlatList, RefreshControl, StyleSheet, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ClientStackParamList} from '@/presentation/navigation/ClientNavigator';
import {
  Button,
  EmptyState,
  ErrorBanner,
  ReservationCard,
  ScreenHeader,
} from '@/presentation/components';
import {useReservationStore, useSessionStore} from '@/presentation/state';

type Props = NativeStackScreenProps<ClientStackParamList, 'ReservationsList'>;

export const ClientReservationsScreen: React.FC<Props> = ({navigation}) => {
  const {user} = useSessionStore();
  const {reservations, loading, error, loadReservations, clearError} = useReservationStore();

  React.useEffect(() => {
    if (user) {
      loadReservations(user.id);
    }
  }, [user, loadReservations]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Mis reservas" subtitle="Gestioná tus viajes" />

      <View style={styles.content}>
        <ErrorBanner message={error} />

        <View style={styles.actionsRow}>
          <Button
            title="+ Nueva reserva"
            onPress={() => {
              clearError();
              navigation.navigate('NewReservation');
            }}
            style={styles.actionButton}
          />
          <Button
            title="Métodos de pago"
            variant="ghost"
            onPress={() => navigation.navigate('PaymentMethods')}
            style={styles.actionButton}
          />
        </View>

        <FlatList
          data={reservations}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ReservationCard reservation={item} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => user && loadReservations(user.id)}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title="Todavía no tenés reservas"
                description="Creá tu primera reserva con el botón de arriba."
              />
            ) : null
          }
          contentContainerStyle={reservations.length === 0 ? styles.flexGrow : undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8fafc'},
  content: {flex: 1, padding: 16},
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
  flexGrow: {flexGrow: 1},
});
