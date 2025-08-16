import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform
} from 'react-native';

const API_URL = 'http://localhost:5000'; // Replace with computer IP for device testing

export default function Onboarding() {
  const [title, setTitle] = useState('');
  const [ticketLink, setTicketLink] = useState('');
  const [about, setAbout] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddMovie = async () => {
    setError('');
    setSuccess('');
    if (!title || !ticketLink || !about || !rating) {
      setError('Please fill all fields and choose a rating.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, ticketLink, about, rating }),
      });
      if (res.ok) {
        setSuccess('Movie added!');
        setTitle('');
        setTicketLink('');
        setAbout('');
        setRating(0);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add movie');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add a New Movie</Text>
      <TextInput
        style={styles.input}
        placeholder="Movie Name"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Ticket Link"
        value={ticketLink}
        onChangeText={setTicketLink}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="About the Movie"
        value={about}
        onChangeText={setAbout}
        multiline
        numberOfLines={4}
      />
      <Text style={styles.label}>Rating:</Text>
      <View style={styles.ratingRow}>
        {[1,2,3,4,5].map(v => (
          <TouchableOpacity key={v} onPress={() => setRating(v)}>
            <Text style={[styles.star, rating >= v && styles.starSelected]}>★</Text>
          </TouchableOpacity>
        ))}
        {rating > 0 && <Text style={styles.ratingVal}>{rating}/5</Text>}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleAddMovie}>
        <Text style={styles.buttonText}>Add Movie</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8fafc' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#56208e', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderRadius: 10, fontSize: 16, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#ccc' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  label: { fontSize: 16, color: '#56208e', fontWeight: 'bold', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  star: { fontSize: 30, color: '#d1d5db', marginHorizontal: 4 },
  starSelected: { color: '#ff6f61' },
  ratingVal: { fontSize: 17, color: '#56208e', marginLeft: 10, fontWeight: 'bold' },
  success: { color: 'green', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  error: { color: 'red', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  button: { backgroundColor: '#56208e', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
