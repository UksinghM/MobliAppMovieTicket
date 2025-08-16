import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface MovieCardProps {
  title: string;
  poster: string;
  description?: string;
  onBook?: () => void;
  onDetails?: () => void;
}

const FALLBACK_POSTER = "https://via.placeholder.com/90x130.png?text=No+Image";

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  poster,
  description,
  onBook,
  onDetails,
}) => {
  const [imgSrc, setImgSrc] = useState(poster || FALLBACK_POSTER);

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imgSrc }}
        style={styles.poster}
        resizeMode="cover"
        onError={() => setImgSrc(FALLBACK_POSTER)}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={onBook}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.detailsButton]} onPress={onDetails}>
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#23233a",
    borderRadius: 12,
    marginBottom: 18,
    padding: 10,
    shadowColor: "#6c63ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  poster: {
    width: 90,
    height: 130,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  title: {
    color: "#e0e0ff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  description: {
    color: "#b0b0d0",
    fontSize: 13,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#6c63ff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 8,
  },
  detailsButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default MovieCard;