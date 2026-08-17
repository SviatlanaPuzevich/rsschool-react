import React from 'react';
import styles from './pokemon.detail.module.css';
import { pokemonService } from '@/services/pokemonService';
import Alert from '../error/Alert';
import TypeTag from '../typeTag/TypeTag';
import PokemonDetailSkeleton from '../pokemonDetailSkeleton/PokemonDetailSkeleton';
import Button from '../button/Button';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface Props {
  id: number;
}

const MAX_STAT_VALUE = 255;

export const PokemonDetail: React.FC<Props> = ({ id }) => {
  const { deleteParam } = useUpdateSearchParams();

  const {
    data: details,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['details', id],
    queryFn: () => pokemonService.getById(id),
  });

  const handleClose = (): void => {
    deleteParam('details');
  };

  const handleInvalidation = () => {
    queryClient.invalidateQueries({ queryKey: ['details', id] });
  };

  if (isLoading) {
    return <PokemonDetailSkeleton />;
  }

  if (isError) {
    return <Alert message={error.message} show />;
  }

  if (!details) {
    return null;
  }

  return (
    <article className={styles.detail}>
      <div className={styles.header}>
        <h2>{details.name}</h2>
        <Button
          onClick={handleInvalidation}
          text="Invalidate cache"
          buttonType="primary"
        />

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
