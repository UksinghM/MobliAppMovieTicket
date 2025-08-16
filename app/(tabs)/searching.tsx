import React, { useState } from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, ImageBackground, Platform, ActivityIndicator, FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import useFetch from "@/services/usefetch";
import { fetchMovies, fetchNowPlayingMovies } from "@/services/api";

// Demo background image (you can change)
const bgImageUrl = 'https://blog-frontend.envato.com/cdn-cgi/image/width=2400,quality=75,format=auto/uploads/sites/2/2023/08/Colour-Scheme-Trends-Blog.jpeg';

// Helper to chunk array into rows for grid
function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

const MovieSearchScreen = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [customMovies, setCustomMovies] = useState([]);
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [ticketLink, setTicketLink] = useState('');
  const [about, setAbout] = useState('');
  const [comments, setComments] = useState({});
  const [currentComment, setCurrentComment] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Fetch movies from TMDB based on search string
  const {
    data: movies,
    loading,
    error,
    refetch
  } = useFetch(() => fetchMovies({ query: search }), false);

  // Fetch now playing movies (static grid)
  const {
    data: latestMovies,
    loading: latestLoading,
    error: latestError,
  } = useFetch(fetchNowPlayingMovies);

  const handleSearchSubmit = () => {
    refetch();
  };

  // Add a custom movie with poster, ticket link, and description
  const handleAddCustomMovie = () => {
    if (!title.trim() || !about.trim() || !ticketLink.trim()) return;
    setCustomMovies([
      ...customMovies,
      { id: Date.now().toString(), title, about, ticketLink, poster: image }
    ]);
    setImage('');
    setTitle('');
    setAbout('');
    setTicketLink('');
    setShowAdd(false);
  };

  // Image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // Add comment for movie id
  const handleAddComment = (movieId) => {
    if (!currentComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), currentComment]
    }));
    setCurrentComment('');
    setSelectedMovieId(movieId);
  };

  // Latest movies grid
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

  // Render movie card with comments and ticket link
  const renderMovie = ({ item }) => (
    <View style={styles.movieCard}>
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : item.poster
              ? item.poster
              : "https://via.placeholder.com/92x138.png?text=No+Image",
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.overview || item.about || 'No description'}
        </Text>
        <TouchableOpacity
          style={styles.ticketButton}
          onPress={() => item.ticketLink
            ? Linking.openURL(item.ticketLink)
            : alert('No ticket link available')
          }
        >
          <Text style={styles.ticketButtonText}>Book Ticket</Text>
        </TouchableOpacity>
        {/* Comments section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsHeader}>Comments</Text>
          <FlatList
            data={comments[item.id] || []}
            keyExtractor={(comment, idx) => idx.toString()}
            renderItem={({ item: comment }) => (
              <Text style={styles.commentText}>{comment}</Text>
            )}
            ListEmptyComponent={<Text style={styles.noComments}>No comments yet</Text>}
            style={{ maxHeight: 70 }}
          />
          <View style={styles.commentInputRow}>
            <TextInput
              value={selectedMovieId === item.id ? currentComment : ''}
              style={styles.commentInput}
              onChangeText={setCurrentComment}
              placeholder="Add public comment..."
              onFocus={() => setSelectedMovieId(item.id)}
              placeholderTextColor="#bbb"
            />
            <TouchableOpacity
              style={styles.addCommentButton}
              onPress={() => handleAddComment(item.id)}
            >
              <Text style={styles.addCommentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
        <View style={{ marginVertical: 12, flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={[styles.baseSubtitle, search.trim() ? styles.dynamicSubtitle : null]}>
            {search.trim() ? `Search: ${search.trim()}` : "Search for movies"}
          </Text>
          <TouchableOpacity style={styles.addCustomButton} onPress={() => setShowAdd(true)}>
            <Text style={styles.addCustomButtonText}>+ Add Movie</Text>
          </TouchableOpacity>
        </View>

        {/* Add custom movie modal/section */}
        {showAdd && (
          <View style={styles.addCustomSection}>
            <Text style={styles.addMovieHeader}>Add a Movie</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Text style={styles.uploadBtnText}>
                {image ? "Change Image" : "Upload Poster"}
              </Text>
            </TouchableOpacity>
            {image ? <Image source={{ uri: image }} style={styles.uploadedImage} /> : null}
            <TextInput
              style={styles.input}
              placeholder="Movie Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#bbb"
            />
            <TextInput
              style={styles.input}
              placeholder="Ticket Link"
              value={ticketLink}
              onChangeText={setTicketLink}
              placeholderTextColor="#bbb"
            />
            <TextInput
              style={[styles.input, { height: 65 }]}
              placeholder="About Movie"
              value={about}
              onChangeText={setAbout}
              placeholderTextColor="#bbb"
              multiline
            />
            <TouchableOpacity style={styles.addCustomSubmitBtn} onPress={handleAddCustomMovie}>
              <Text style={styles.addCustomSubmitBtnText}>Save Movie</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <Text style={styles.cancelAdd}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps='handled'
        >
          <Text style={styles.sectionHeader}>Latest Movies</Text>
          {latestLoading ? (
            <ActivityIndicator color="#6c63ff" size="small" style={{ marginVertical: 32 }} />
          ) : latestError ? (
            <Text style={styles.errorText}>Error loading latest movies</Text>
          ) : (
            <View style={styles.latestMoviesList}>
              {renderLatestMoviesGrid()}
            </View>
          )}

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
            movies.map((item) => <View key={item.id}>{renderMovie({ item })}</View>)
          ) : (
            <Text style={styles.errorText}>No movies found</Text>
          )}

          {/* Custom movies */}
          {customMovies.length > 0 && (
            <View>
              <Text style={styles.sectionHeader}>Your Added Movies</Text>
              {customMovies.map((item) => (
                <View key={item.id}>{renderMovie({ item })}</View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', position: 'absolute' },
  gradientOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(40,20,70,0.36)' },
  container: { flex: 1, backgroundColor: 'transparent' },
  logoRow: { alignItems: "center", marginTop: 18, marginBottom: 2 },
  header: { fontSize: 34, fontWeight: '700', color: '#fff', textShadowColor: '#555', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 7, letterSpacing: 1 },
  glassBox: { marginTop: 25, marginHorizontal: 18, padding: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.34)', shadowColor: '#222', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.06, shadowRadius: 13, elevation: Platform.OS === 'android' ? 5 : 0 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.86)', borderRadius: 10, borderWidth: 1, borderColor: '#ff6f61', paddingHorizontal: 9, paddingVertical: Platform.OS === 'android' ? 4 : 9, marginTop: 8 },
  searchInput: { flex: 1, fontSize: 17, color: '#56208e', fontWeight: '600', letterSpacing: 0.6, paddingVertical: 6, paddingLeft: 9 },
  baseSubtitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', letterSpacing: 0.2 },
  dynamicSubtitle: { color: '#6c63ff' },
  addCustomButton: { marginLeft: 10, backgroundColor: '#6c63ff', borderRadius: 11, paddingVertical: 4, paddingHorizontal: 14, alignSelf: 'center' },
  addCustomButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  addCustomSection: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginHorizontal: 15, marginBottom: 20, shadowColor: '#4b257a', shadowOpacity: 0.14, shadowRadius: 14, elevation: 5 },
  addMovieHeader: { fontSize: 22, fontWeight: '700', color: '#6c63ff', marginBottom: 10, textAlign: 'center' },
  uploadBtn: { backgroundColor: '#e2e8f0', borderRadius: 10, alignItems: 'center', padding: 9, marginBottom: 10 },
  uploadBtnText: { color: '#56208e', fontWeight: '700' },
  uploadedImage: { width: 120, height: 170, borderRadius: 12, marginBottom: 12, alignSelf: 'center' },
  input: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, borderWidth: 2, borderColor: '#6c63ff', fontSize: 16, fontWeight: '600', color: '#1f2937', paddingHorizontal: 16, paddingVertical: 10, marginBottom: 12 },
  addCustomSubmitBtn: { backgroundColor: '#6c63ff', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  addCustomSubmitBtnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  cancelAdd: { color: '#ff6f61', fontWeight: '700', fontSize: 16, textAlign: 'center', marginTop: 13 },

  sectionHeader: { fontSize: 22, fontWeight: "bold", color: "#6c63ff", marginBottom: 18, marginTop: 24, textAlign: "center" },
  latestMoviesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22, paddingHorizontal: 12 },
  latestMoviesList: { alignSelf: "center", width: "100%", marginBottom: 30 },
  staticCard: { marginHorizontal: 6, backgroundColor: "#23233a", borderRadius: 14, padding: 10, alignItems: "center", minWidth: 90, maxWidth: 120, flex: 1 },
  staticPoster: { width: 110, height: 170, borderRadius: 10, backgroundColor: "#333" },
  staticTitle: { color: "#e0e0ff", fontWeight: "700", fontSize: 15, marginTop: 8, textAlign: "center" },
  movieCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 18, marginBottom: 26, padding: 12, shadowColor: '#8855e2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 16, elevation: Platform.OS === 'android' ? 7 : 0, alignItems: 'center', borderWidth: 0.4, borderColor: '#cecafe' },
  poster: { width: 90, height: 135, borderRadius: 13, marginRight: 15, backgroundColor: '#eee', borderWidth: 1, borderColor: '#ecb8e6' },
  movieInfo: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 21, fontWeight: 'bold', color: '#56208e', marginBottom: 3 },
  description: { fontSize: 15, color: '#333', marginBottom: 4, fontStyle: 'italic' },
  ticketButton: { backgroundColor: '#6c63ff', borderRadius: 7, paddingVertical: 7, paddingHorizontal: 20, alignSelf: 'flex-start', marginBottom: 9, marginTop: 5 },
  ticketButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  errorText: { fontSize: 18, color: '#ff6f61', textAlign: 'center', marginTop: 40, fontWeight: '800', textShadowColor: '#fff', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 3 },
  commentsSection: { marginTop: 9, backgroundColor: '#f7f8fe', borderRadius: 10, padding: 10 },
  commentsHeader: { color: '#6c63ff', fontWeight: '700', fontSize: 16, marginBottom: 6 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  commentInput: { flex: 1, backgroundColor: '#fff', borderRadius: 7, padding: 8, borderWidth: 1, borderColor: '#f3defa', color: '#56208e', fontSize: 15 },
  addCommentButton: { backgroundColor: '#6c63ff', marginLeft: 7, paddingVertical: 7, paddingHorizontal: 16, borderRadius: 7 },
  addCommentButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  commentText: { color: '#333', fontSize: 14, marginBottom: 3 },
  noComments: { color: '#a39dc3', fontSize: 15, fontStyle: 'italic', marginTop: 2 },
});

export default MovieSearchScreen;
