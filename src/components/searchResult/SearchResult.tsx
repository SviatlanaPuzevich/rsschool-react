import { Component } from 'react';
import type { Pokemon } from '../../types.ts';
import styles from './search.result.module.css';
import Pagination from '../pagination/Pagination.tsx';
import PokemonCard from '../pokemonCard/PokemonCard.tsx';

interface Props {
  pokemons: Pokemon[];
  error?: boolean;
}

interface State {
  currentPage: number;
}

const POKEMON_PAGE_SIZE = 5;
const POKEMON_COLUMN_COUNT = 3;

class SearchResult extends Component<Props, State> {
  state: State = {
    currentPage: 1,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.pokemons !== this.props.pokemons) {
      this.setState({ currentPage: 1 });
    }
  }

  handlePageChange = (page: number) => {
    this.setState({
      currentPage: page,
    });
  };

  render() {
    const { pokemons, error } = this.props;
    const { currentPage } = this.state;

    if (error) {
      throw new Error('This error was generated');
    }

    if (pokemons.length === 0) {
      return <div>No such pokemon</div>;
    }

    const pagesCount = Math.ceil(
      pokemons.length / (POKEMON_PAGE_SIZE * POKEMON_COLUMN_COUNT)
    );

    const startIndex =
      (currentPage - 1) * POKEMON_PAGE_SIZE * POKEMON_COLUMN_COUNT;
    const currentPokemons = pokemons.slice(
      startIndex,
      startIndex + POKEMON_PAGE_SIZE * POKEMON_COLUMN_COUNT
    );

    return (
      <>
        <h2>List of pokemons</h2>
        <div className={styles['container']}>
          {currentPokemons.map((item: Pokemon) => (
            <PokemonCard pokemon={item} key={item.id} />
          ))}
        </div>
        <Pagination
          count={pagesCount}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </>
    );
  }
}

export default SearchResult;
