import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'https://www.omdbapi.com/?&apikey=6d06693d';

function Home() {
  const [movies, setMovies] = useState([]);
  const [titleSearchTerm, setTitleSearchTerm] = useState(''); // Separado para busca por título
  const [selectedCountry, setSelectedCountry] = useState(''); // País
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lista de países para o dropdown
  const countryOptions = [
    { code: 'us', name: 'United States' },
    { code: 'fr', name: 'France' },
    { code: 'in', name: 'India' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'jp', name: 'Japan' },
    { code: 'ca', name: 'Canada' },
    { code: 'br', name: 'Brazil' },
    { code: 'de', name: 'Germany' },
    { code: 'es', name: 'Spain' },
    { code: 'it', name: 'Italy' },
    { code: 'au', name: 'Australia' },
    { code: 'mx', name: 'Mexico' },
    { code: 'ru', name: 'Russia' },
    { code: 'cn', name: 'China' },
    { code: 'za', name: 'South Africa' },

    // Adicione outros países conforme necessário
  ];

  // Método para busca por título
  const searchMovies = async () => {
    setLoading(true);
    setError(null);
    setMovies([]); // Resetar o estado dos filmes para nova busca
    try {
      const response = await fetch(`${API_URL}&s=${titleSearchTerm}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search);
      } else {
        setError('Nenhum filme encontrado');
      }
    } catch (err) {
      setError('Erro ao buscar filmes');
    } finally {
      setLoading(false);
    }
  };

  // Método para buscar filmes pelo país selecionado
  const searchMoviesByCountry = async () => {
    setLoading(true);
    setError(null);
    setMovies([]); // Resetar o estado dos filmes para nova busca
    try {
      const response = await fetch(`${API_URL}&s=${titleSearchTerm}`);
      const data = await response.json();
      if (data.Response === 'True') {
        // Filtra filmes pelo país usando chamada individual para cada filme
        const filteredMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const movieResponse = await fetch(`${API_URL}&i=${movie.imdbID}`);
            const movieData = await movieResponse.json();
            return movieData.Country &&
              movieData.Country.toLowerCase().includes(selectedCountry)
              ? movieData
              : null;
          })
        );
        const moviesFromCountry = filteredMovies.filter(
          (movie) => movie !== null
        );
        if (moviesFromCountry.length > 0) {
          setMovies(moviesFromCountry);
        } else {
          setError('Nenhum filme encontrado para o país selecionado');
        }
      } else {
        setError('Nenhum filme encontrado');
      }
    } catch (err) {
      setError('Erro ao buscar filmes');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleSearchTerm.trim()) {
      searchMovies();
    }
  };

  const handleCountrySubmit = (e) => {
    e.preventDefault();
    searchMoviesByCountry();
  };

  return (
    <div>
      <form onSubmit={handleTitleSubmit}>
        <input
          type="text"
          placeholder="Digite o título do filme"
          value={titleSearchTerm}
          onChange={(e) => setTitleSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar por Título</button>
      </form>

      <form onSubmit={handleCountrySubmit}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countryOptions.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <button type="submit">Buscar por País</button>
      </form>

      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}

      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="movie">
            <Link to={`/movie/${movie.imdbID}`}>
              <h2>
                {movie.Title} ({movie.Year})
              </h2>
              {movie.Poster !== 'N/A' ? (
                <img src={movie.Poster} alt={`${movie.Title} Poster`} />
              ) : (
                <p>Poster não disponível</p>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
