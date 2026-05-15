import styles from './pokemon.card.module.css';
import type { Pokemon } from '../../types.ts';

interface Props {
  pokemon: Pokemon;
}

const PokemonCard = ({ pokemon }: Props) => {
  return (
    <div className={styles.item}>
      <figure className={styles.imgContainer}>
        <img
          className={styles.pokemonImg}
          src={pokemon.image}
          alt={pokemon.name}
        />
        <figcaption className={styles.caption}>{pokemon.name}</figcaption>
      </figure>
      {pokemon.abilities && <div>{pokemon.abilities}</div>}
    </div>
  );
};

export default PokemonCard;
