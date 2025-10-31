import React, { useEffect, useState } from "react";
import "./App.css";

const apiKey = "9f2d6b1d0f2bf9d8f05b3c1308f1abb3";

function App() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("");

  // Fetch movies
  const getMovies = (page = 1) => {
    let url = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        let fetchedMovies = data.results || [];
        setTotalPages(data.total_pages || 1);

        if (sortType) fetchedMovies = sortMovies(fetchedMovies, sortType);
        setMovies(fetchedMovies);
      })
      .catch((err) => console.error("Error:", err));
  };

  const sortMovies = (movies, sortType) => {
    const sorted = [...movies];
    switch (sortType) {
      case "release date ascending":
        return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      case "release date descending":
        return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      case "rating ascending":
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      case "rating descending":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      default:
        return sorted;
    }
  };

  useEffect(() => {
    getMovies(currentPage);
  }, [currentPage, sortType, searchQuery]);

  return (
    <div>
      <nav className="navbar">
        <h1>Movie Explorer</h1>
      </nav>

      <div className="navbar2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getMovies(1);
          }}
        >
          <input
            type="text"
            id="search"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <select
          id="select"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="release date ascending">Release Date (Asc)</option>
          <option value="release date descending">Release Date (Desc)</option>
          <option value="rating ascending">Rating (Asc)</option>
          <option value="rating descending">Rating (Desc)</option>
        </select>
      </div>

      <div id="movie-container" className="movie-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
            <p>Release: {movie.release_date}</p>
            <p>Rating: {movie.vote_average}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
          Previous
        </button>
        <span id="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
