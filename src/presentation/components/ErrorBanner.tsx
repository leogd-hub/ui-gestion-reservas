import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface ErrorBannerProps {
  message?: string | null;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({message}) => {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  text: {
    color: '#991b1b',
    fontSize: 13,
    fontWeight: '500',
  },
});
