import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

type Genre = 'Action' | 'Drama' | 'Love' | 'India' | 'Hollywood' | 'Bollywood' | 'Japanese Anime';

const genreOptions: Genre[] = [
  'Action',
  'Drama',
  'Love',
  'India',
  'Hollywood',
  'Bollywood',
  'Japanese Anime',
];

const bgImageUrl =
  'https://blog-frontend.envato.com/cdn-cgi/image/width=2400,quality=75,format=auto/uploads/sites/2/2023/08/Colour-Scheme-Trends-Blog.jpeg';

export default function Onboarding() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [about, setAbout] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [addedMovies, setAddedMovies] = useState<any[]>([]);

  const handleGenreToggle = (genre: Genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleAddMovie = () => {
    if (!title.trim() || !price.trim() || !link.trim() || !about.trim() || selectedGenres.length === 0 || rating === 0) {
      setError('Please fill all fields, select at least one genre, and provide a rating.');
      return;
    }
    const newMovie = {
      id: Date.now().toString(),
      title,
      poster: `https://picsum.photos/150/200?random=${Math.floor(Math.random() * 100)}`,
      description: about,
      genres: selectedGenres,
      price,
      link,
      rating,
    };
    setAddedMovies([...addedMovies, newMovie]);
    setTitle('');
    setPrice('');
    setLink('');
    setAbout('');
    setSelectedGenres([]);
    setRating(0);
    setError('');
  };

  return (
    <ImageBackground
      source={{ uri: bgImageUrl }}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.6 }}
    >
      <LinearGradient
        colors={['rgba(40, 20, 70, 0.4)', 'rgba(40, 20, 70, 0.7)']}
        style={styles.overlay}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInUp" duration={800} style={styles.container}>
          <Text style={styles.header}>Add a New Movie</Text>
          <Animatable.View animation="zoomIn" delay={200}>
            <TextInput
              style={styles.input}
              placeholder="Movie Name"
              placeholderTextColor="#a1a1aa"
              value={title}
              onChangeText={setTitle}
            />
          </Animatable.View>
          <Animatable.View animation="zoomIn" delay={300}>
            <TextInput
              style={styles.input}
              placeholder="Ticket Price (₹ or $)"
              placeholderTextColor="#a1a1aa"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </Animatable.View>
          <Animatable.View animation="zoomIn" delay={400}>
            <TextInput
              style={styles.input}
              placeholder="Movie Link"
              placeholderTextColor="#a1a1aa"
              value={link}
              onChangeText={setLink}
            />
          </Animatable.View>
          <Animatable.View animation="zoomIn" delay={500}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="About the Movie"
              placeholderTextColor="#a1a1aa"
              value={about}
              onChangeText={setAbout}
              multiline
              numberOfLines={4}
            />
          </Animatable.View>
          <Text style={styles.label}>Select Genres:</Text>
          <View style={styles.genreList}>
            {genreOptions.map((genre) => (
              <Animatable.View key={genre} animation="bounceIn" delay={600}>
                <TouchableOpacity
                  style={[
                    styles.genreChip,
                    selectedGenres.includes(genre) && styles.genreChipSelected,
                  ]}
                  onPress={() => handleGenreToggle(genre)}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      styles.genreChipText,
                      selectedGenres.includes(genre) && styles.genreChipTextSelected,
                    ]}
                  >
                    {genre}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
          <Text style={styles.label}>Give a Rating:</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Animatable.View key={star} animation="pulse" delay={700}>
                <TouchableOpacity onPress={() => handleRating(star)}>
                  <Text style={[styles.star, rating >= star && styles.starFilled]}>★</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
            {rating > 0 && <Text style={styles.ratingVal}>{rating}/5</Text>}
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Animatable.View animation="zoomIn" delay={800}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddMovie}>
              <LinearGradient
                colors={['#ff6f61', '#e11d48']}
                style={styles.gradientButton}
              >
                <Text style={styles.addButtonText}>Add Movie</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
          {addedMovies.length > 0 && (
            <Animatable.View animation="zoomIn" delay={900}>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: 'transparent' }]}
                onPress={() =>
                  router.push({ pathname: '/', params: { addedMovies: JSON.stringify(addedMovies) } })
                }
              >
                <LinearGradient
                  colors={['#56208e', '#7c3aed']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.addButtonText}>Go to Movie Search Page</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </Animatable.View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: Platform.OS === 'android' ? 15 : 0,
    zIndex: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: '900',
    color: '#4c1d95',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6f61',
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6f61',
    marginBottom: 8,
    marginTop: 4,
  },
  genreList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  genreChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#ff6f61',
    marginBottom: 8,
  },
  genreChipSelected: {
    backgroundColor: '#ff6f61',
    borderColor: '#fff',
  },
  genreChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff6f61',
  },
  genreChipTextSelected: {
    color: '#fff',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  star: {
    fontSize: 32,
    color: '#d1d5db',
    marginHorizontal: 3,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  starFilled: {
    color: '#ff6f61',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  ratingVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4c1d95',
    marginLeft: 12,
  },
  errorText: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  addButton: {
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});