import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {ReservationStatus} from '@/domain/entities/Reservation';

const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En curso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

const STATUS_COLOR: Record<ReservationStatus, {bg: string; fg: string}> = {
  PENDING: {bg: '#fef3c7', fg: '#92400e'},
  CONFIRMED: {bg: '#dbeafe', fg: '#1e40af'},
  IN_PROGRESS: {bg: '#e0e7ff', fg: '#3730a3'},
  COMPLETED: {bg: '#dcfce7', fg: '#166534'},
  CANCELLED: {bg: '#fee2e2', fg: '#991b1b'},
};

interface StatusBadgeProps {
  status: ReservationStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
  const color = STATUS_COLOR[status];

  return (
    <View style={[styles.badge, {backgroundColor: color.bg}]}>
      <Text style={[styles.text, {color: color.fg}]}>{STATUS_LABEL[status]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
