import styles from './pokemon.item.module.css';
import type { Pokemon } from '../../types.ts';

interface Props {
    pokemon: Pokemon;
}

const PokemonItem = ({ pokemon }: Props) => {
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
                <div>More Details...</div>
            </div>
        </div>
    );
};

export default PokemonItem;
