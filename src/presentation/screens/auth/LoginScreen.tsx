import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '@/presentation/navigation/AuthNavigator';
import {Button, ErrorBanner, TextField} from '@/presentation/components';
import {useSessionStore} from '@/presentation/state';
import type {UserRole} from '@/domain/entities/User';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {login, loading, error, clearError} = useSessionStore();
  const [email, setEmail] = React.useState('client@demo.com');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('CLIENT');

  const handleSubmit = () => {
    clearError();
    login({email, password, role});
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <ErrorBanner message={error} />

        <View style={styles.roleSwitch}>
          {(['CLIENT', 'ADMIN'] as UserRole[]).map(item => (
            <TouchableOpacity
              key={item}
              style={[styles.roleOption, role === item && styles.roleOptionActive]}
              onPress={() => setRole(item)}
              accessibilityRole="button"
            >
              <Text style={[styles.roleText, role === item && styles.roleTextActive]}>
                {item === 'CLIENT' ? 'Cliente' : 'Administrador'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="tucorreo@dominio.com"
        />
        <TextField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        <Button title="Iniciar sesión" onPress={handleSubmit} loading={loading} />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => {
            clearError();
            navigation.navigate('Register');
          }}
        >
          <Text style={styles.registerLinkText}>¿No tenés cuenta? Registrate</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Demo: client@demo.com (Cliente) / admin@demo.com (Administrador)
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#fff'},
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    marginTop: 4,
  },
  roleSwitch: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 4,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  roleOptionActive: {
    backgroundColor: '#2563eb',
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  roleTextActive: {
    color: '#fff',
  },
  registerLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    marginTop: 24,
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
