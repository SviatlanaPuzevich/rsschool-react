import React, { useState, useEffect } from 'react';
import styles from './pokemon.detail.module.css';
import type { PokemonDetails } from '../../types.ts';
import { pokemonService } from '../../services/pokemonService.ts';
import Alert from '../error/Alert.tsx';
import Loader from '../loader/Loader.tsx';
import TypeTag from '../typeTag/TypeTag.tsx';

interface PokemonDetailProps {
  pokemonId: number | undefined;
}

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonId }) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (pokemonId === undefined) {
        setLoaded(true);
        return;
      }

      setLoaded(false);
      setError(null);

      try {
        const data = await pokemonService.getById(pokemonId);
        setDetails(data);
        setLoaded(true);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Cannot load details');
        setLoaded(true);
      }
    };

    fetchData();
  }, [pokemonId]);

  if (error) {
    return <Alert message={error} show={true} />;
  }

  if (!loaded) {
    return <Loader />;
  }

  if (!details) {
    return null;
  }

  return (
    <div className={styles.details}>
      {details.soundUrl && (
        <audio className={styles.audio} controls src={details.soundUrl} />
      )}
      <div>
        {details.types.map((type) => (
          <TypeTag key={type} type={type.toLowerCase()} />
        ))}
      </div>
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
  );
};

export default PokemonDetail;
