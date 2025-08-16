import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import useFetch from "@/services/usefetch";
import { fetchMovies, fetchNowPlayingMovies } from "@/services/api";

const bgImageUrl = 'https://blog-frontend.envato.com/cdn-cgi/image/width=2400,quality=75,format=auto/uploads/sites/2/2023/08/Colour-Scheme-Trends-Blog.jpeg';

function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

const MovieSearchScreen: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  // Fetch movies from TMDB based on search string
  const {
    data: movies,
    loading,
    error,
    refetch
  } = useFetch(() => fetchMovies({ query: search }), false);

  // Fetch latest now playing movies
  const {
    data: latestMovies,
    loading: latestLoading,
    error: latestError,
  } = useFetch(fetchNowPlayingMovies);

  const handleSearchSubmit = () => {
    refetch();
  };

  // Render latest movies as a grid (4 per row)
  const renderLatestMoviesGrid = () => {
    if (!latestMovies || latestMovies.length === 0) return null;
    const rows = chunkArray(latestMovies, 4);
    return rows.map((row, idx) => (
      <View style={styles.latestMoviesRow} key={`latest-movies-row-${idx}`}>
        {row.map((item) => (
          <View style={styles.staticCard} key={item.id}>
            <Image
              source={{
                uri: item.poster_path
                  ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                  : "https://via.placeholder.com/100x145.png?text=No+Image",
              }}
              style={styles.staticPoster}
              resizeMode="cover"
            />
            <Text style={styles.staticTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        ))}
      </View>
    ));
  };

  const renderMovie = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.92}
      style={styles.movieCard}
      onPress={() =>
        router.push({ pathname: `/${item.id}`, params: { id: item.id } })
      }
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : "https://via.placeholder.com/92x138.png?text=No+Image",
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.overview || 'No description'}
        </Text>
        <Text style={styles.genreText}>
          {item.release_date ? item.release_date.slice(0, 4) : "Unknown Year"}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.82}
            onPress={() =>
              router.push({
                pathname: '/booking',
                params: { movieId: item.id, title: item.title },
              })
            }
          >
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.detailsButton]}
            activeOpacity={0.82}
            onPress={() =>
              router.push({
                pathname: `/${item.id}`,
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: bgImageUrl }}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.7 }}
    >
      <View style={styles.gradientOverlay} />
      <SafeAreaView style={styles.container}>
        {/* Header and search box */}
        <View style={styles.logoRow}>
          <Text style={styles.header}>MovieFinder</Text>
        </View>
        <View style={styles.glassBox}>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor="#bbb"
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        </View>
        <View style={{ marginTop: 10, marginBottom: 12 }}>
          <Text style={[styles.baseSubtitle, search.trim() ? styles.dynamicSubtitle : null]}>
            {search.trim() ? `Search here ${search.trim()}` : "Search here movies"}
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps='handled'
        >
          {/* Latest Movies Section */}
          <Text style={styles.sectionHeader}>Latest Movies</Text>
          {latestLoading ? (
            <ActivityIndicator color="#6c63ff" size="small" style={{ marginTop: 32, marginBottom: 32 }} />
          ) : latestError ? (
            <Text style={styles.errorText}>Error loading latest movies</Text>
          ) : (
            <View style={styles.latestMoviesList}>
              {renderLatestMoviesGrid()}
            </View>
          )}

          {/* Add some spacing below latest movies */}
          <View style={{ height: 32 }} />

          {/* Search Results */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#ff6f61"
              style={{ marginTop: 40, alignSelf: "center" }}
            />
          ) : error ? (
            <Text style={styles.errorText}>Error: {error.message}</Text>
          ) : movies && movies.length > 0 ? (
            movies.map((item) => (
              <View key={item.id} style={styles.movieCard}>
                {renderMovie({ item })}
              </View>
            ))
          ) : (
            <Text style={styles.errorText}>No movies found</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(40,20,70,0.28)',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  logoRow: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 2,
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#555',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 7,
    letterSpacing: 1,
  },
  glassBox: {
    marginTop: 25,
    marginHorizontal: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // Glass effect
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 13,
    elevation: Platform.OS === 'android' ? 5 : 0,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff6f61',
    paddingHorizontal: 9,
    paddingVertical: Platform.OS === 'android' ? 4 : 9,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#56208e',
    fontWeight: '600',
    letterSpacing: 0.6,
    paddingVertical: 6,
    paddingLeft: 9,
  },

  // Base subtitle style (white, bold)
  baseSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Dynamic subtitle style (purple and bold)
  dynamicSubtitle: {
    color: '#6c63ff',
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 18,
    marginBottom: 22,
    padding: 16,
    shadowColor: '#883399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.33,
    shadowRadius: 10,
    elevation: Platform.OS === 'android' ? 6 : 0,
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: '#ffdada',
    borderStyle: 'solid',
  },
  poster: {
    width: 95,
    height: 145,
    borderRadius: 13,
    marginRight: 15,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ecb8e6',
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#56208e',
    marginBottom: 3,
  },
  description: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  genreText: {
    fontSize: 14,
    color: '#ff6f61',
    marginBottom: 7,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 9,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ff6f61',
    marginRight: 8,
  },
  detailsButton: {
    backgroundColor: '#ff6f61',
    borderWidth: 0,
  },
  buttonText: {
    color: '#ff6f61',
    fontSize: 15,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6f61',
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '800',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  staticCard: {
    marginHorizontal: 6,
    backgroundColor: "#23233a",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    minWidth: 90,
    maxWidth: 120,
    flex: 1,
  },
  staticPoster: {
    width: 110,
    height: 170,
    borderRadius: 10,
    backgroundColor: "#333",
  },
  staticTitle: {
    color: "#e0e0ff",
    fontWeight: "700",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6c63ff",
    marginBottom: 18,
    marginTop: 24,
    textAlign: "center",
  },
  latestMoviesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    paddingHorizontal: 12,
  },
  latestMoviesList: {
    alignSelf: "center",
    width: "100%",
    marginBottom: 30,
  },
});

export default MovieSearchScreen;
