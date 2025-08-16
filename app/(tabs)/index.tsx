import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/usefetch";
import { fetchMovies, fetchNowPlayingMovies } from "@/services/api";
import SearchBar from "@/components/searchBar";
import MovieCard from "@/components/movieCard";

const BG_IMAGE_URL =
  "https://mir-s3-cdn-cf.behance.net/project_modules/fs/8470be155522753.635686ea23ebf.jpg";

// Utility to chunk array into rows
function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

const Index = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch search results manually on demand
  const {
    data: searchedMovies,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useFetch(() => fetchMovies({ query: searchTerm }), false);

  // Fetch latest "Now Playing" movies for static section
  const {
    data: latestMovies,
    loading: latestLoading,
    error: latestError,
  } = useFetch(fetchNowPlayingMovies);

  // Trigger search only on submit
  const handleSearchSubmit = () => {
    if (searchTerm.trim().length > 0) {
      refetchSearch();
    }
  };

  // Helper function to open external booking site with error check
  const openBooking = async (title) => {
    // Encode movie title for URL query
    const encodedTitle = encodeURIComponent(title.trim());
    // Example BookMyShow Mumbai search URL with movie title pre-filled
    const url = `https://in.bookmyshow.com/explore/movies-mumbai?q=${encodedTitle}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert(
        "Error",
        "Cannot open booking site. The URL may be invalid or unsupported."
      );
    }
  };

  const renderMovie = ({ item }) => (
    <View style={styles.movieCard}>
      <MovieCard
        title={item.title}
        poster={
          item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : undefined
        }
        description={item.overview}
        // Open BookMyShow search page for the movie title in Mumbai on "Book Now"
        onBook={() => openBooking(item.title)}
        onDetails={() =>
          router.push({
            pathname: `/${item.id}`,
            params: { id: item.id },
          })
        }
      />
    </View>
  );

  // Latest Movies Manual Grid (4 per row)
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

  return (
    <ImageBackground
      source={{ uri: BG_IMAGE_URL }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Movie Explorer</Text>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search for movies..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearchSubmit}
        />

        {/* Latest Movies Grid (manual 4-column grid) */}
        <Text style={styles.sectionHeader}>Latest Movies</Text>
        {latestLoading ? (
          <ActivityIndicator color="#6c63ff" size="small" />
        ) : latestError ? (
          <Text style={styles.errorText}>Error loading latest movies</Text>
        ) : (
          <View style={styles.latestMoviesList}>{renderLatestMoviesGrid()}</View>
        )}

        {/* Spacing */}
        <View style={{ height: 32 }} />

        {/* Search Results Listing in grid 3 columns */}
        {searchLoading ? (
          <ActivityIndicator
            color="#6c63ff"
            size="large"
            style={{ marginTop: 40 }}
          />
        ) : searchError ? (
          <Text style={styles.errorText}>Error: {searchError.message}</Text>
        ) : searchedMovies && searchedMovies.length > 0 ? (
          // Manual grid for 3 columns, chunk and render rows
          chunkArray(searchedMovies, 3).map((row, idx) => (
            <View style={styles.searchResultsRow} key={`search-row-${idx}`}>
              {row.map((item) => (
                <View style={styles.movieCard} key={item.id}>
                  <MovieCard
                    title={item.title}
                    poster={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                        : undefined
                    }
                    description={item.overview}
                    onBook={() => openBooking(item.title)}
                    onDetails={() =>
                      router.push({
                        pathname: `/${item.id}`,
                        params: { id: item.id },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No movies found.</Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26,26,46,0.72)",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40, // Added for scroll area bottom space
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#e0e0ff",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "#6c63ff",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6c63ff",
    marginBottom: 12,
    marginTop: 16,
    textAlign: "center",
  },
  latestMoviesList: {
    alignSelf: "center",
    width: "100%",
    marginBottom: 24,
  },
  latestMoviesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
    paddingHorizontal: 8,
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
  searchResultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  movieCard: {
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 12,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  noData: {
    color: "#8888aa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
});

export default Index;
