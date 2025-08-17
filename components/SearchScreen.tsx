import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet, FlatList, Text, Button, Alert, ActivityIndicator } from "react-native";
import axios from "axios";

// --- SearchBar COMPONENT ---
interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  onFocus?: () => void;
  style?: any;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  onFocus,
  style
}) => (
  <View style={[searchBarStyles.container, style]}>
    <Image
      source={require("../assets/search.png")} // Make sure you have this icon!
      style={searchBarStyles.icon}
      resizeMode="contain"
    />
    <TextInput
      style={searchBarStyles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#A8B5DB"
      returnKeyType="search"
      onSubmitEditing={onSubmitEditing}
      clearButtonMode="while-editing"
      onFocus={onFocus}
    />
  </View>
);

const searchBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23233a",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#AB8BFF",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
});

// --- MAIN SEARCHSCREEN ---
const TMDB_API_KEY = "YOUR_TMDB_API_KEY"; // <-- Set your TMDB API key here!
const BACKEND_URL = "http://localhost:5000/api"; // <-- Use your backend's IP if testing on device
const userId = "user123"; // <-- Replace or pass the real user ID

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  [key: string]: any;
}

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const searchMovies = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
        },
      });
      setResults(res.data.results || []);
    } catch (err: any) {
      Alert.alert("Search error", err.message || "Failed to search movies.");
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (movie: Movie) => {
    try {
      await axios.post(`${BACKEND_URL}/search`, {
        userId,
        searchTerm: query,
        movie,
      });
      Alert.alert("Saved!", "Search saved in history.");
    } catch (err: any) {
      Alert.alert("Save error", err.message || "Failed to save search.");
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search movie..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchMovies}
      />
      {loading ? (
        <ActivityIndicator size="large" style={{ margin: 16 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              <Text style={styles.title}>{item.title}</Text>
              {item.poster_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                  style={styles.poster}
                />
              )}
              <Button title="Save Search" onPress={() => saveSearch(item)} />
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No movies found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2f", padding: 16 },
  movieItem: {
    marginVertical: 12,
    backgroundColor: "#23233a",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  title: { color: "#fff", fontWeight: "bold", fontSize: 18, textAlign: "center" },
  poster: { width: 100, height: 150, marginVertical: 8, borderRadius: 8 },
  empty: { color: "#A8B5DB", textAlign: "center", marginTop: 24, fontSize: 16 },
});

export default SearchScreen;
