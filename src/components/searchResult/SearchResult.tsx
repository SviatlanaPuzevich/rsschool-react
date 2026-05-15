import type { Pokemon } from '../../types.ts';
import styles from './search.result.module.css';
import Pagination from '../pagination/Pagination.tsx';
import { POKEMON_NUMBER_ON_PAGE } from '../../constants/layout.ts';
import { SEARCH_RESULT } from '../../constants/messages.ts';
import { Outlet, useParams } from 'react-router-dom';
import PokemonItem from '../pokemonItem/PokemonItem.tsx';

interface Props {
  pokemons: Pokemon[];
}

const SearchResult = ({ pokemons }: Props) => {
  const params = useParams<{ page: string }>();
  const currentPage = Number(params.page) || 1;

  if (pokemons.length === 0) {
    return <div>{SEARCH_RESULT.NOT_FOUND}</div>;
  }

  const pagesCount = Math.ceil(pokemons.length / POKEMON_NUMBER_ON_PAGE);

  const startIndex = (currentPage - 1) * POKEMON_NUMBER_ON_PAGE;
  const currentPokemons = pokemons.slice(
    startIndex,
    startIndex + POKEMON_NUMBER_ON_PAGE
  );

  return (
    <>
      <h2>List of pokemons</h2>
      <div className={styles.container}>
        <div className={styles.list}>
          {currentPokemons.map((item: Pokemon) => (
            <PokemonItem pokemon={item} key={item.id} />
          ))}
        </div>
        <Outlet />
      </div>
      <Pagination count={pagesCount} />
    </>
  );
};

export default SearchResult;
