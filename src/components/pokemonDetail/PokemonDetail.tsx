import React, { useEffect, useState } from 'react';
import styles from './pokemon.detail.module.css';
import type { PokemonDetails } from '../../types.ts';
import { pokemonService } from '../../services/pokemonService.ts';
import Alert from '../error/Alert.tsx';
import TypeTag from '../typeTag/TypeTag.tsx';
import PokemonDetailSkeleton from '../pokemonDetailSkeleton/PokemonDetailSkeleton.tsx';
import Button from '../button/Button.tsx';
import { useUpdateSearchParams } from '../../hooks/useUpdateSearchParams.ts';

interface Props {
  id: number;
}

const MAX_STAT_VALUE = 255;

export const PokemonDetail: React.FC<Props> = ({ id }) => {
  const { deleteParam } = useUpdateSearchParams();

  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setLoaded(false);
      setError(null);

      try {
        const data = await pokemonService.getById(id);
        setDetails(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Cannot load details');
      } finally {
        setLoaded(true);
      }
    };

    fetchData();
  }, [id]);

  const handleClose = (): void => {
    deleteParam('details');
  };

  if (!loaded) {
    return <PokemonDetailSkeleton />;
  }

  if (error) {
    return (
      <Alert message={error} show />
    );
  }

  if (!details) {
    return null;
  }

  return (
    <article className={styles.detail}>
      <div className={styles.header}>
        <h2>{details.name}</h2>

        <Button onClick={handleClose} text="×" buttonType="danger" />
      </div>

      <p className={styles.id}>#{details.id}</p>

      <div className={styles.sprites}>
        {details.sprites.frontDefault && (
          <figure>
            <img
              src={details.sprites.frontDefault}
              alt={`${details.name} front`}
            />
            <figcaption>Front</figcaption>
          </figure>
        )}

        {details.sprites.backDefault && (
          <figure>
            <img
              src={details.sprites.backDefault}
              alt={`${details.name} back`}
            />
            <figcaption>Back</figcaption>
          </figure>
        )}

        {details.sprites.frontShiny && (
          <figure>
            <img
              src={details.sprites.frontShiny}
              alt={`${details.name} shiny front`}
            />
            <figcaption>Shiny front</figcaption>
          </figure>
        )}

        {details.sprites.backShiny && (
          <figure>
            <img
              src={details.sprites.backShiny}
              alt={`${details.name} shiny back`}
            />
            <figcaption>Shiny back</figcaption>
          </figure>
        )}
      </div>

      <div className={styles.types}>
        {details.types.map((type) => (
          <TypeTag key={type} type={type} />
        ))}
      </div>

      {details.soundUrl && (
        <audio controls src={details.soundUrl}>
          Your browser does not support audio.
        </audio>
      )}

      <dl className={styles.info}>
        <div>
          <dt>Height</dt>
          <dd>{details.height / 10} m</dd>
        </div>

        <div>
          <dt>Weight</dt>
          <dd>{details.weight / 10} kg</dd>
        </div>

        <div>
          <dt>Abilities</dt>
          <dd>{details.abilities.join(', ')}</dd>
        </div>
      </dl>

      <section className={styles.stats}>
        <h3>Base stats</h3>

        {details.stats.map((stat) => {
          const percentage = Math.min((stat.value / MAX_STAT_VALUE) * 100, 100);

          return (
            <div className={styles.stat} key={stat.name}>
              <div className={styles.statInfo}>
                <span>{stat.name}</span>
                <span>{stat.value}</span>
              </div>

              <div
                className={styles.progress}
                role="progressbar"
                aria-label={`${stat.name} ${stat.value}`}
                aria-valuenow={stat.value}
                aria-valuemin={0}
                aria-valuemax={MAX_STAT_VALUE}
              >
                <div
                  className={styles.progressValue}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </article>
  );
};

export default PokemonDetail;
