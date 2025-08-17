import React, { useState } from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, ImageBackground, Platform, ActivityIndicator, FlatList,
  Linking   // ✅ Add this import
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import useFetch from "@/services/usefetch";
import { fetchMovies, fetchNowPlayingMovies } from "@/services/api";


// Demo background image
const bgImageUrl = 'https://blog-frontend.envato.com/cdn-cgi/image/width=2400,quality=75,format=auto/uploads/sites/2/2023/08/Colour-Scheme-Trends-Blog.jpeg';


// Helper to chunk array into rows for grid
function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}


const BookingPage = () => {
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

  // Fetch movies based on search
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

  // Add a custom movie
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
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Add comment
  const handleAddComment = (movieId) => {
    if (!currentComment.trim()) return;
    setComments(prev => ({
      ...prev,
      [movieId]: [...(prev[movieId] || []), currentComment]
    }));
    setCurrentComment('');
    setSelectedMovieId(movieId);
  };

  // Open BookMyShow website
  const openBookingSite = () => {
    Linking.openURL("https://in.bookmyshow.com/explore/movies");
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

  // Render movie card
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

        {/* ✅ Updated Book Ticket button */}
        <TouchableOpacity style={styles.ticketButton} onPress={openBookingSite}>
          <Text style={styles.ticketButtonText}>Book Ticket</Text>
        </TouchableOpacity>

        {/* Comments */}
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
          <Text style={styles.header}>🎬 Movie Booking</Text>
        </View>
        <View style={styles.glassBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#bbb"
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>

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
            <ActivityIndicator size="large" color="#ff6f61" style={{ marginTop: 40, alignSelf: "center" }} />
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

export default BookingPage;
