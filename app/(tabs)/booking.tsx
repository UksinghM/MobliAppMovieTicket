import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const API_URL = 'http://localhost:5000';  // Change to your backend URL / IP

export default function BookingPage() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(() => setError('Failed to load movies'));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Book Your Movie Ticket</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {movies.length === 0 ? (
        <Text style={styles.noData}>No movies available</Text>
      ) : (
        movies.map(movie => (
          <View key={movie._id} style={styles.card}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.about}>{movie.about}</Text>
            <Text style={styles.rating}>Rating: {movie.rating}/5</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL(movie.ticketLink)}
            >
              <Text style={styles.linkButtonText}>Buy Ticket</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f8fafc' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#56208e', marginBottom: 24, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#56208e',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#56208e', marginBottom: 8 },
  about: { fontSize: 14, color: '#4b5563', marginBottom: 8 },
  rating: { fontSize: 14, color: '#ff6f61', fontWeight: 'bold', marginBottom: 10 },
  linkButton: { backgroundColor: '#ff6f61', borderRadius: 8, padding: 10, alignItems: 'center' },
  linkButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  error: { color: 'red', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  noData: { textAlign: 'center', color: '#888' },
});
