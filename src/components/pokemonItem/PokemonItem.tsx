import styles from './pokemon.item.module.css';
import type { Pokemon } from '../../types.ts';
import { Link, useParams } from 'react-router-dom';
import { BASE_ROUTE, SEARCH } from '../../constants/routing.ts';
import usePokemonStore from '../../stores/usePokemonStore.ts';

interface Props {
  pokemon: Pokemon;
}

const PokemonItem = ({ pokemon }: Props) => {
  const { page = 1, pokemonId } = useParams<{
    page: string;
    pokemonId: string | undefined;
  }>();

  const selectedPokemons = usePokemonStore((state) => state.selectedPokemons);
  const selectPokemon = usePokemonStore((state) => state.selectPokemon);
  const unselectPokemon = usePokemonStore((state) => state.unselectPokemon);

  const isChecked = selectedPokemons.includes(pokemon.id);
  const isDetailed =
    pokemonId === undefined ? false : Number(pokemonId) === pokemon.id;
  const handleCheckPkemon = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      selectPokemon(pokemon.id);
    } else {
      unselectPokemon(pokemon.id);
    }
  };

  return (
    <div
      className={
        isDetailed ? `${styles.item} ${styles.selectedItem}` : styles.item
      }
    >
      <div className={styles.selected}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckPkemon}
          data-testid={`checkbox-${pokemon.id}`}
        />
      </div>
      <div className={styles.left}>
        <img
          className={styles.pokemonImg}
          src={pokemon.image}
          alt={pokemon.name}
        />
      </div>
      <div className={styles.right}>
        <p className={styles.desc}>{pokemon.name}</p>
        <Link to={`${BASE_ROUTE}${SEARCH}/${page}/${pokemon.id}`}>
          More Details...
        </Link>
      </div>
    </div>
  );
};

export default PokemonItem;
