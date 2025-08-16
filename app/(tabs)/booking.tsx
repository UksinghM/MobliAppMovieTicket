import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingScreen() {
  const { movieId, title } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Book Tickets for {title}</Text>
      <Text style={styles.text}>Movie ID: {movieId}</Text>
      <Text style={styles.text}>This is a placeholder booking screen.</Text>
      {/* Add more features here later, like seat selection */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});