import React from 'react';
import styles from './pokemon.detail.module.css';
import { pokemonService } from '@/services/pokemonService';
import Alert from '../error/Alert';
import TypeTag from '../typeTag/TypeTag';
import PokemonDetailSkeleton from '../pokemonDetailSkeleton/PokemonDetailSkeleton';
import Button from '../button/Button';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Props {
  id: number;
}

const MAX_STAT_VALUE = 255;

export const PokemonDetail: React.FC<Props> = ({ id }) => {
  const { deleteParam } = useUpdateSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations('Pokemon');

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
          text={t('invalidateCache')}
          buttonType="primary"
        />

        <Button
          onClick={handleClose}
          text="×"
          ariaLabel={t('close')}
          buttonType="danger"
        />
      </div>

      <p className={styles.id}>#{details.id}</p>

      <div className={styles.sprites}>
        {details.sprites.frontDefault && (
          <figure>
            <Image
              src={details.sprites.frontDefault}
              alt={`${details.name} front`}
              width={96}
              height={96}
            />
            <figcaption>{t('front')}</figcaption>
          </figure>
        )}

        {details.sprites.backDefault && (
          <figure>
            <Image
              src={details.sprites.backDefault}
              alt={`${details.name} back`}
              width={96}
              height={96}
            />
            <figcaption>{t('back')}</figcaption>
          </figure>
        )}

        {details.sprites.frontShiny && (
          <figure>
            <Image
              src={details.sprites.frontShiny}
              alt={`${details.name} shiny front`}
              width={96}
              height={96}
            />
            <figcaption>{t('shinyFront')}</figcaption>
          </figure>
        )}

        {details.sprites.backShiny && (
          <figure>
            <Image
              src={details.sprites.backShiny}
              alt={`${details.name} shiny back`}
              width={96}
              height={96}
            />
            <figcaption>{t('shinyBack')}</figcaption>
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
          {t('audioUnsupported')}
        </audio>
      )}

      <dl className={styles.info}>
        <div>
          <dt>{t('height')}</dt>
          <dd>{t('meters', { value: details.height / 10 })}</dd>
        </div>

        <div>
          <dt>{t('weight')}</dt>
          <dd>{t('kilograms', { value: details.weight / 10 })}</dd>
        </div>

        <div>
          <dt>{t('abilities')}</dt>
          <dd>{details.abilities.join(', ')}</dd>
        </div>
      </dl>

      <section className={styles.stats}>
        <h3>{t('baseStats')}</h3>

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
