import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ClientStackParamList} from '@/presentation/navigation/ClientNavigator';
import {Button, EmptyState, ErrorBanner, ScreenHeader, TextField} from '@/presentation/components';
import {usePaymentStore, useSessionStore} from '@/presentation/state';
import type {PaymentMethodType} from '@/domain/entities/Payment';

type Props = NativeStackScreenProps<ClientStackParamList, 'PaymentMethods'>;

export const PaymentMethodsScreen: React.FC<Props> = () => {
  const {user} = useSessionStore();
  const {methods, loading, error, loadMethods, addMethod, setDefault, clearError} =
    usePaymentStore();
  const [alias, setAlias] = React.useState('');
  const [type] = React.useState<PaymentMethodType>('CARD');

  React.useEffect(() => {
    if (user) {
      loadMethods(user.id);
    }
  }, [user, loadMethods]);

  const handleAdd = () => {
    if (!user || !alias.trim()) {
      return;
    }
    clearError();
    addMethod({userId: user.id, type, alias}).then(() => setAlias(''));
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Métodos de pago" subtitle="Administrá tus formas de pago" />
      <View style={styles.content}>
        <ErrorBanner message={error} />

        <View style={styles.addRow}>
          <View style={styles.addInput}>
            <TextField
              label="Alias"
              value={alias}
              onChangeText={setAlias}
              placeholder="Ej: Visa personal"
            />
          </View>
          <Button title="Agregar" onPress={handleAdd} loading={loading} disabled={!alias.trim()} />
        </View>

        <FlatList
          data={methods}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.methodRow}>
              <View>
                <Text style={styles.methodAlias}>{item.alias}</Text>
                <Text style={styles.methodType}>{item.type}</Text>
              </View>
              {item.isDefault ? (
                <Text style={styles.defaultTag}>Predeterminado</Text>
              ) : (
                <TouchableOpacity onPress={() => user && setDefault(user.id, item.id)}>
                  <Text style={styles.setDefaultText}>Hacer predeterminado</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            !loading ? (
              <EmptyState
                title="Sin métodos de pago"
                description="Agregá un método de pago para completar tus reservas."
              />
            ) : null
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8fafc'},
  content: {flex: 1, padding: 16},
  addRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  addInput: {
    flex: 1,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 10,
  },
  methodAlias: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  methodType: {
    fontSize: 12,
    color: '#64748b',
  },
  defaultTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
});
