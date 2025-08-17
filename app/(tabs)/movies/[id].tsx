import React, { useEffect, useState } from "react";

const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjMzNDRiMTkzMDI3NTY4MTkzMDQyYmI1MjRhYTg0MiIsIm5iZiI6MTczOTM0NzM3MC4wNDYwMDAyLCJzdWIiOiI2N2FjNTVhYTIxZDBhOTJkNGI5Yjk2M2EiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.yS6WPYjGcaxHkfsYrqmijak7A_NVuEawsL_mYKFdjEc";

const fetchMovieDetails = async (id) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return await response.json();
};

const MovieInfo = ({ label, value }) => (
  <div style={{ marginTop: 20 }}>
    <div style={{ color: "#ccc", fontSize: 12 }}>{label}</div>
    <div style={{ fontWeight: "bold", fontSize: 14, marginTop: 6 }}>
      {value || "N/A"}
    </div>
  </div>
);

const Movieworkers = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      fetchMovieDetails(id)
        .then((data) => {
          setMovie(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!movie) return <div>No movie found</div>;

  return (
    <div style={{ backgroundColor: "#111", minHeight: "100vh", color: "white", padding: 20 }}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        style={{ width: "100%", maxHeight: 550, objectFit: "cover" }}
      />
      <h1 style={{ marginTop: 20 }}>{movie.title}</h1>
      <div style={{ marginTop: 5, color: "#aaa" }}>
        {movie.release_date?.split("-")[0]} • {movie.runtime}m
      </div>
      <div
        style={{
          marginTop: 10,
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#222",
          borderRadius: 5,
          padding: "2px 8px",
          gap: 6,
        }}
      >
        <span>⭐</span>
        <span style={{ fontWeight: "bold" }}>{Math.round(movie.vote_average)}/10</span>
        <span style={{ color: "#bbb" }}>({movie.vote_count} votes)</span>
      </div>

      <MovieInfo label="Overview" value={movie.overview} />
      <MovieInfo label="Genres" value={movie.genres?.map((g) => g.name).join(" • ")} />
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 400 }}>
        <MovieInfo label="Budget" value={`$${(movie.budget / 1_000_000).toFixed(1)} million`} />
        <MovieInfo label="Revenue" value={`$${(movie.revenue / 1_000_000).toFixed(1)} million`} />
      </div>
      <MovieInfo
        label="Production Companies"
        value={movie.production_companies?.map((c) => c.name).join(" • ")}
      />
    </div>
  );
};

export default Movieworkers;
