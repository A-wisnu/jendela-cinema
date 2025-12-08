import { useState, useEffect } from 'react';
import './MovieLobby.css';

const API_KEY = '034fd7d00aa9bacd49eed80bc9aab23c';
const API_READ_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMzRmZDdkMDBhYTliYWNkNDllZWQ4MGJjOWFhYjIzYyIsIm5iZiI6MTc2NTE4NzA2NS43NTcsInN1YiI6IjY5MzY5ZGY5YzI1ODU1YzU3YTRlNTJhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.889twlkDmb9FxuJXmCgYHneU2tEYAcudjocM-OiuVXk';

const MovieLobby = ({ onSelectMovie }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchIndonesianMovies();
    }, []);

    const fetchIndonesianMovies = async () => {
        try {
            // Fetch 5 pages to get 100 movies (20 per page)
            const pages = [1, 2, 3, 4, 5];
            const allMovies = [];

            for (const page of pages) {
                const response = await fetch(
                    `https://api.themoviedb.org/3/discover/movie?language=id-ID&region=ID&with_origin_country=ID&sort_by=popularity.desc&page=${page}`,
                    {
                        headers: {
                            Authorization: `Bearer ${API_READ_TOKEN}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const data = await response.json();
                if (data.results) {
                    allMovies.push(...data.results);
                }
            }

            setMovies(allMovies);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
        }
    };

    const filteredMovies = movies.filter(movie => {
        const query = searchQuery.toLowerCase();
        const title = (movie.title || '').toLowerCase();
        const originalTitle = (movie.original_title || '').toLowerCase();
        return title.includes(query) || originalTitle.includes(query);
    });

    return (
        <div className="movie-lobby">
            <div className="halftone-bg"></div>

            <div className="lobby-header">
                <h1 className="lobby-title">AMBIL WAKTUMU</h1>
                <p className="lobby-subtitle">Pilih Target Anda</p>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Cari film..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner rotate"></div>
                    <p>Memuat film...</p>
                </div>
            ) : filteredMovies.length === 0 ? (
                <div className="no-results">
                    <p className="no-results-text">Tidak ada film yang ditemukan untuk "{searchQuery}"</p>
                    <p className="no-results-hint">Coba kata kunci lain</p>
                </div>
            ) : (
                <div className="movie-grid">
                    {filteredMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className="movie-card"
                            onClick={() => onSelectMovie(movie)}
                        >
                            <div className="movie-poster-container">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="movie-poster"
                                />
                                <div className="movie-overlay">
                                    <div className="movie-rating">
                                        ★ {movie.vote_average.toFixed(1)}
                                    </div>
                                </div>
                            </div>
                            <div className="movie-info">
                                <h3 className="movie-title">{movie.title}</h3>
                                <p className="movie-date">{movie.release_date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MovieLobby;
