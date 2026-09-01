import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSessionStore} from '@/presentation/state';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({title, subtitle}) => {
  const {user, logout} = useSessionStore();

  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {user ? <Text style={styles.user}>{user.fullName}</Text> : null}
      </View>
      <TouchableOpacity accessibilityRole="button" onPress={() => logout()} style={styles.logout}>
        <Text style={styles.logoutText}>Salir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  user: {
    fontSize: 12,
    color: '#2563eb',
    marginTop: 2,
    fontWeight: '600',
  },
  logout: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#991b1b',
    fontWeight: '700',
    fontSize: 13,
  },
});
