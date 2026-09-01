import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  Button,
  EmptyState,
  ErrorBanner,
  ReservationCard,
  ScreenHeader,
} from '@/presentation/components';
import {useReservationStore} from '@/presentation/state';
import type {Reservation, ReservationStatus} from '@/domain/entities/Reservation';

const STATUS_FILTERS: Array<{label: string; value: ReservationStatus | 'ALL'}> = [
  {label: 'Todas', value: 'ALL'},
  {label: 'Pendientes', value: 'PENDING'},
  {label: 'Confirmadas', value: 'CONFIRMED'},
  {label: 'En curso', value: 'IN_PROGRESS'},
  {label: 'Completadas', value: 'COMPLETED'},
  {label: 'Canceladas', value: 'CANCELLED'},
];

const NEXT_ACTIONS: Record<ReservationStatus, Array<{label: string; status: ReservationStatus}>> = {
  PENDING: [
    {label: 'Confirmar', status: 'CONFIRMED'},
    {label: 'Cancelar', status: 'CANCELLED'},
  ],
  CONFIRMED: [
    {label: 'Iniciar viaje', status: 'IN_PROGRESS'},
    {label: 'Cancelar', status: 'CANCELLED'},
  ],
  IN_PROGRESS: [{label: 'Completar', status: 'COMPLETED'}],
  COMPLETED: [],
  CANCELLED: [],
};

export const AdminReservationsScreen: React.FC = () => {
  const {reservations, loading, error, loadReservations, updateStatus} = useReservationStore();
  const [filter, setFilter] = React.useState<ReservationStatus | 'ALL'>('ALL');

  React.useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const filtered = React.useMemo<Reservation[]>(
    () => (filter === 'ALL' ? reservations : reservations.filter(item => item.status === filter)),
    [reservations, filter],
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Reservas" subtitle="Panel de administración" />

      <View style={styles.content}>
        <ErrorBanner message={error} />

        <View style={styles.filters}>
          {STATUS_FILTERS.map(item => (
            <TouchableOpacity
              key={item.value}
              style={[styles.filterChip, filter === item.value && styles.filterChipActive]}
              onPress={() => setFilter(item.value)}
            >
              <Text style={[styles.filterText, filter === item.value && styles.filterTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => loadReservations()} />
          }
          renderItem={({item}) => (
            <ReservationCard
              reservation={item}
              footer={
                NEXT_ACTIONS[item.status].length > 0 ? (
                  <View style={styles.actionsRow}>
                    {NEXT_ACTIONS[item.status].map(action => (
                      <Button
                        key={action.status}
                        title={action.label}
                        variant={action.status === 'CANCELLED' ? 'danger' : 'primary'}
                        style={styles.actionButton}
                        onPress={() => updateStatus(item.id, action.status)}
                      />
                    ))}
                  </View>
                ) : undefined
              }
            />
          )}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title="No hay reservas"
                description="Cuando los clientes creen reservas, van a aparecer acá."
              />
            ) : null
          }
          contentContainerStyle={filtered.length === 0 ? styles.flexGrow : undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8fafc'},
  content: {flex: 1, padding: 16},
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  filterTextActive: {
    color: '#fff',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
  },
  flexGrow: {flexGrow: 1},
});
