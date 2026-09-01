import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

interface TextFieldProps extends TextInputProps {
  label: string;
  errorText?: string | null;
}

export const TextField: React.FC<TextFieldProps> = ({label, errorText, style, ...rest}) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, errorText ? styles.inputError : null, style]}
      placeholderTextColor="#94a3b8"
      autoCapitalize="none"
      {...rest}
    />
    {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
});
