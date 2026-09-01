import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {Reservation} from '@/domain/entities/Reservation';
import {StatusBadge} from './StatusBadge';

interface ReservationCardProps {
  reservation: Reservation;
  footer?: React.ReactNode;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({reservation, footer}) => {
  const origin = reservation.stops.find(stop => stop.type === 'ORIGIN');
  const destination = reservation.stops.find(stop => stop.type === 'DESTINATION');

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.id}>#{reservation.id.slice(-6).toUpperCase()}</Text>
        <StatusBadge status={reservation.status} />
      </View>

      <Text style={styles.route}>
        {origin ? origin.address.label : 'Origen'} →{' '}
        {destination ? destination.address.label : 'Destino'}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{new Date(reservation.scheduledAt).toLocaleString()}</Text>
        <Text style={styles.meta}>{reservation.passengers} pasajero(s)</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          {reservation.estimatedDistanceKm} km · {reservation.estimatedDurationMin} min
        </Text>
        <Text style={styles.price}>
          {reservation.currency} {reservation.totalPrice.toFixed(2)}
        </Text>
      </View>

      {reservation.notes ? <Text style={styles.notes}>{reservation.notes}</Text> : null}

      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  id: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  route: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#64748b',
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  notes: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
