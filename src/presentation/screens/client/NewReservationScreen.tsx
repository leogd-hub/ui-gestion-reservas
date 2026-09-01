import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ClientStackParamList} from '@/presentation/navigation/ClientNavigator';
import {Button, ErrorBanner, TextField} from '@/presentation/components';
import {useReservationStore, useSessionStore} from '@/presentation/state';
import {services} from '@/infrastructure/mocks/container';
import type {SearchAddressResult} from '@/domain/services/IMapService';
import type {StopType} from '@/domain/entities/Reservation';

type Props = NativeStackScreenProps<ClientStackParamList, 'NewReservation'>;

const AddressPicker: React.FC<{
  label: string;
  type: StopType;
}> = ({label, type}) => {
  const {addStop} = useReservationStore();
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchAddressResult[]>([]);
  const [searching, setSearching] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (!query.trim()) {
      setResults([]);
      return undefined;
    }

    setSearching(true);
    services.mapService.searchAddress(query).then(found => {
      if (active) {
        setResults(found);
        setSearching(false);
      }
    });

    return () => {
      active = false;
    };
  }, [query]);

  return (
    <View style={styles.pickerContainer}>
      <TextField
        label={label}
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar dirección..."
      />
      {searching ? <Text style={styles.hint}>Buscando...</Text> : null}
      {results.map(result => (
        <TouchableOpacity
          key={`${result.label}-${result.street}`}
          style={styles.resultRow}
          onPress={() => {
            addStop(result, type);
            setQuery('');
            setResults([]);
          }}
        >
          <Text style={styles.resultLabel}>{result.label}</Text>
          <Text style={styles.resultSub}>
            {result.street}, {result.city}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const NewReservationScreen: React.FC<Props> = ({navigation}) => {
  const {user} = useSessionStore();
  const {
    draft,
    setDraftMeta,
    removeStop,
    createReservation,
    clearDraft,
    loading,
    error,
    clearError,
  } = useReservationStore();

  React.useEffect(() => {
    clearDraft();
    clearError();
  }, [clearDraft, clearError]);

  const canSubmit =
    !!user &&
    draft.scheduledAt.trim().length > 0 &&
    draft.passengers > 0 &&
    draft.stops.length >= 2;

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    const created = await createReservation(user.id);
    if (created) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nueva reserva</Text>

        <ErrorBanner message={error} />

        <TextField
          label="Fecha y hora (ej: 2025-06-20T10:30)"
          value={draft.scheduledAt}
          onChangeText={value => setDraftMeta({scheduledAt: value})}
          placeholder="2025-06-20T10:30"
        />

        <TextField
          label="Pasajeros"
          value={String(draft.passengers)}
          onChangeText={value =>
            setDraftMeta({passengers: Number(value.replace(/[^0-9]/g, '')) || 1})
          }
          keyboardType="number-pad"
        />

        <AddressPicker label="Origen" type="ORIGIN" />
        <AddressPicker label="Destino" type="DESTINATION" />

        {draft.stops.length > 0 ? (
          <FlatList
            data={draft.stops}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.stopRow}>
                <Text style={styles.stopText}>
                  {item.order}. [{item.type}] {item.address.label}
                </Text>
                <TouchableOpacity onPress={() => removeStop(item.id)}>
                  <Text style={styles.removeText}>Quitar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : null}

        <TextField
          label="Notas (opcional)"
          value={draft.notes}
          onChangeText={value => setDraftMeta({notes: value})}
          multiline
        />

        <Button
          title="Confirmar reserva"
          onPress={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#fff'},
  container: {padding: 20},
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  resultRow: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginBottom: 6,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  resultSub: {
    fontSize: 11,
    color: '#64748b',
  },
  stopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stopText: {
    fontSize: 13,
    color: '#0f172a',
    flex: 1,
  },
  removeText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '700',
  },
});
