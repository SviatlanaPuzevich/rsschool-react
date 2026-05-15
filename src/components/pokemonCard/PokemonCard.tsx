import styles from './pokemon.card.module.css';
import type { PokemonDetails } from '../../types.ts';
import { useEffect, useState } from 'react';
import { pokemonService } from '../../services/pokemon.ts';
import { ERROR_MESSAGE, LOADING } from '../../constants/messages.ts';
import Alert from '../error/Alert.tsx';
import { useParams } from 'react-router-dom';

const PokemonCard = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const [details, setDetails] = useState<PokemonDetails>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoaded(false);
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

  if (error) {
    return <Alert message={error} />;
  }

  if (!loaded) {
    return <p>{LOADING}</p>;
  }

  return (
    <div className={styles.item}>
      <audio controls src={details.soundUrl} />
      <div>Abilities: {details.abilities.join(',')}</div>
      <div>Weight: {details.weight}</div>
      <div>Height: {details.height}</div>
    </div>
  );
};

export default PokemonCard;
