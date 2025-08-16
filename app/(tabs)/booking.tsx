import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Linking, StyleSheet, Image } from 'react-native';

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
            {movie.poster && (
              <Image
                source={{ uri: movie.poster }}
                style={styles.poster}
                resizeMode="cover"
              />
            )}
            <View style={styles.movieInfo}>
              <Text style={styles.title} numberOfLines={1}>{movie.title}</Text>
              <Text style={styles.about} numberOfLines={3}>{movie.about}</Text>
              <Text style={styles.rating}>Rating: {movie.rating}/5</Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => Linking.openURL(movie.ticketLink)}
              >
                <Text style={styles.linkButtonText}>Buy Ticket</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 30, backgroundColor: '#f9f9ff' },
  header: { fontSize: 28, fontWeight: '900', color: '#4b257a', marginBottom: 30, textAlign: 'center' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 24, elevation: 6 },
  poster: { width: 100, height: 150, borderRadius: 14, backgroundColor: '#ddd', marginRight: 16 },
  movieInfo: { flex: 1, justifyContent: 'space-between' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4b257a', marginBottom: 6 },
  about: { fontSize: 15, color: '#6b6b7a', marginBottom: 12, lineHeight: 20 },
  rating: { fontSize: 14, color: '#c96c6c', fontWeight: '700', marginBottom: 12 },
  linkButton: { backgroundColor: '#6f42c1', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  linkButtonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  error: { color: '#e03131', fontWeight: '700', marginBottom: 14, textAlign: 'center', fontSize: 16 },
  noData: { textAlign: 'center', color: '#9999aa', fontSize: 16 },
});
