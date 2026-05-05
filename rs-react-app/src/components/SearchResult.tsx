import { Component } from 'react';
import type { Pokemon } from '../types.ts';
import styles from './search.bar.module.css';
import Pagination from "./Pagination.tsx";

interface Props {
  pokemons: Pokemon[];
}

interface State {
  currentPage: number;
}

const POKEMON_PAGE_SIZE = 10;

class SearchResult extends Component<Props, State> {
  state: State = {
    currentPage: 1,
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.pokemons !== this.props.pokemons) {
      this.setState({ currentPage: 1 });
    }
  }

  handlePageChange = (page: number) => {
    this.setState({
      currentPage: page
    });
  }

  render() {
    const { pokemons } = this.props;
    const { currentPage } = this.state;

    if (pokemons.length === 0) {
      return <div>No such pokemon</div>;
    }

    const pagesCount = Math.ceil(pokemons.length / POKEMON_PAGE_SIZE);

    const startIndex = (currentPage - 1) * POKEMON_PAGE_SIZE;
    const currentPokemons = pokemons.slice(startIndex, startIndex + POKEMON_PAGE_SIZE);

    return (
        <>
          <div>
            <h2>List of pokemons</h2>
            {currentPokemons.map((item: Pokemon) => (
                <div key={item.id} className={styles.item}>
                  <figure className={styles.imgContainer}>
                    <img
                        className={styles.pokemonImg}
                        src={item.image}
                        alt={item.name}
                    />
                    <figcaption className={styles.caption}>{item.name}</figcaption>
                  </figure>
                  {item.abilities && <div>{item.abilities}</div>}
                </div>
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