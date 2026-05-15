import styles from './pokemon.item.module.css';
import type { Pokemon } from '../../types.ts';
import { Link, useParams } from 'react-router-dom';
import { BASE_ROUTE } from '../../constants/routing.ts';

interface Props {
  pokemon: Pokemon;
}

const PokemonItem = ({ pokemon }: Props) => {
  const { page = 1 } = useParams<{ page: string }>();

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <img
          className={styles.pokemonImg}
          src={pokemon.image}
          alt={pokemon.name}
        />
      </div>
      <div className={styles.right}>
        <p className={styles.desc}>{pokemon.name}</p>
        <Link to={`${BASE_ROUTE}/${page}/${pokemon.id}`}>More Details...</Link>
      </div>
    </div>
  );
};

export default PokemonItem;
