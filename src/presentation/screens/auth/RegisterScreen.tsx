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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const {register, loading, error, clearError} = useSessionStore();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('CLIENT');

  const handleSubmit = () => {
    clearError();
    register({fullName, email, password, role});
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Registrate para empezar a reservar</Text>

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

        <TextField label="Nombre completo" value={fullName} onChangeText={setFullName} />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextField label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />

        <Button
          title="Crear cuenta"
          onPress={handleSubmit}
          loading={loading}
          disabled={!fullName || !email || !password}
        />

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => {
            clearError();
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.loginLinkText}>¿Ya tenés cuenta? Iniciá sesión</Text>
        </TouchableOpacity>
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
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
});
