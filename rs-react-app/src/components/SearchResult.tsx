import { Component } from 'react';
import type { Pokemon } from '../types.ts';
import styles from './search.bar.module.css';

interface Props {
  pokemons: Pokemon[];
}

class SearchResult extends Component<Props> {
  render() {
    if (this.props.pokemons.length === 0) {
      return <div>No such pokemon</div>;
    }
    return (
      <div>
        <h2>List of pokemons</h2>
        {this.props.pokemons.map((item: Pokemon) => (
          <div key={item.id} className={styles.item}>
            <figure className={styles.imgContainer}>
              <img
                className={styles.pokemonImg}
                src={item.image}
                alt={item.name}
              />
              <figcaption>{item.name}</figcaption>
            </figure>
            <div>{item.abilities}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default SearchResult;
