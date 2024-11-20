// components/MovieDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = 'https://www.omdbapi.com/?apikey=3481d86d';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}&i=${id}`);
        const data = await response.json();
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError('Detalhes do filme não encontrados');
        }
      } catch (err) {
        setError('Erro ao buscar detalhes do filme');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return movie ? (
    <div>
      <Link to="/">Voltar à busca</Link>
      <h2>
        {movie.Title} ({movie.Year})
      </h2>
      <p>
        <strong>País:</strong> {movie.Country}
      </p>
      <p>
        <strong>Gênero:</strong> {movie.Genre}
      </p>
      <p>
        <strong>Atores:</strong> {movie.Actors}
      </p>
      <p>
        <strong>Enredo:</strong> {movie.Plot}
      </p>
      {movie.Poster !== 'N/A' && (
        <img src={movie.Poster} alt={`${movie.Title} Poster`} />
      )}
    </div>
  ) : null;
}

export default MovieDetails;
