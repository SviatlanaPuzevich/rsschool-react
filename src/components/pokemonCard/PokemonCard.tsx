import styles from './pokemon.card.module.css';
import type { PokemonDetails } from '../../types.ts';
import { useEffect, useState } from 'react';
import { pokemonService } from '../../services/pokemon.ts';
import { ERROR_MESSAGE } from '../../constants/messages.ts';
import Alert from '../error/Alert.tsx';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader.tsx';
import { BASE_ROUTE } from '../../constants/routing.ts';

const PokemonCard = () => {
  const navigate = useNavigate();
  const { pokemonId, page } = useParams<{
    pokemonId: string | undefined;
    page: string;
  }>();
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!pokemonId) return;

      setLoaded(false);
      setError(null);
      try {
        const details = await pokemonService.getById(pokemonId);

        setDetails(details);
        setLoaded(true);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : ERROR_MESSAGE.SERVER_ERROR);
        setLoaded(true);
      }
    };

    fetchData();
  }, [pokemonId]);

  const handleCloseClick = () => {
    navigate(BASE_ROUTE + `/${page}`);
  };

  if (error) {
    return <Alert message={error} />;
  }

  if (!details) {
    return null;
  }

  if (!loaded) {
    return <Loader />;
  }

  return (
    <div className={styles.card}>
      <h3>{details.name}</h3>
      {details.soundUrl && <audio controls src={details.soundUrl} />}
      <div className={styles.details}>
        <div>
          <b>Abilities:</b> <i>{details.abilities.join(', ')}</i>
        </div>
        <div>
          <b>Weight:</b> <i>{details.weight}</i>
        </div>
        <div>
          <b>Height:</b> <i>{details.height}</i>
        </div>
      </div>
      <button
        className={styles.close}
        onClick={handleCloseClick}
        aria-label="Close pokemon card"
      >
        ×
      </button>
    </div>
  );
};

export default PokemonCard;
