import React, { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Loader from '@/components/loader/Loader';
import styles from '@/app/[locale]/(site)/search/search.page.module.css';
import SearchBar from '@/components/searchBar/SearchBar';
import Flyout from '@/components/flyout/Flyout';
import PokemonDetail from '@/components/pokemonDetail/PokemonDetail';
import { pokemonService } from '@/services/pokemonService';
import PokemonDetailSkeleton from '@/components/pokemonDetailSkeleton/PokemonDetailSkeleton';
import type { Pokemon } from '@/types';
import PokemonCard from '@/components/pokemonCard/PokemonCard';
import Pagination from '@/components/pagination/Pagination';

const PAGE_SIZE = 5;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ query?: string; page?: string; id?: string }>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Search');

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query || '';
  const selectedPokemonId = Number(resolvedSearchParams.id) || null;

  const pokemons = await pokemonService.getAll();

  if (pokemons.length === 0) {
    return <div>{t('noResults')}</div>;
  }

  const trimmedQuery = query.trim().toLowerCase();
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().startsWith(trimmedQuery)
  );

  const pagesCount = Math.ceil(filteredPokemons.length / PAGE_SIZE) || 1;

  const rawPage = Number(resolvedSearchParams.page) || 1;
  const page = rawPage > pagesCount ? 1 : rawPage;

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedPokemons = filteredPokemons.slice(startIndex, endIndex);

  const closeParams = new URLSearchParams();
  if (query) closeParams.set('query', query);
  if (page !== 1) closeParams.set('page', String(page));
  const closeHref = closeParams.toString()
    ? `?${closeParams.toString()}`
    : './search';

  return (
    <>
      <div className={styles.container}>
        <h1>{t('title')}</h1>

        <SearchBar initialQuery={query} />

        <section className={styles.result}>
          <h2>{t('results')}</h2>
          <div className={styles.resultContainer}>
            <Suspense fallback={<Loader />}>
              <div className={styles.list}>
                {paginatedPokemons.length > 0 ? (
                  paginatedPokemons.map((item: Pokemon) => (
                    <PokemonCard
                      key={item.id}
                      pokemon={item}
                      isSelected={selectedPokemonId === item.id}
                    />
                  ))
                ) : (
                  <div>{t('noResults')}</div>
                )}
              </div>
            </Suspense>

            {selectedPokemonId && (
              <Suspense fallback={<PokemonDetailSkeleton />}>
                <PokemonDetail id={selectedPokemonId} closeHref={closeHref} />
              </Suspense>
            )}
          </div>

            <Pagination count={pagesCount} currentPage={page} />
        </section>
      </div>

      <Flyout />
    </>
  );
};

export default Page;
