import styles from './pokemon.card.module.css';
import { useEffect } from 'react';
import Alert from '../error/Alert.tsx';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader.tsx';
import { BASE_ROUTE } from '../../constants/routing.ts';
import usePokemonStore from '../../stores/usePokemonStore.ts';

const PokemonCard = () => {
  const navigate = useNavigate();
  const { pokemonId } = useParams<{
    pokemonId: string | undefined;
  }>();
  const details = usePokemonStore((state) => state.pokemonDetails);
  const isLoading = usePokemonStore((state) => state.isDetailsLoading);
  const error = usePokemonStore((state) => state.pokemonDetailsError);
  const fetchDetails = usePokemonStore(
    (state) => state.fetchPokemonDetailsById
  );

  useEffect(() => {
    if (!pokemonId) return;

    fetchDetails(pokemonId);
  }, [pokemonId, fetchDetails]);

  const handleCloseClick = () => {
    navigate(`${BASE_ROUTE}`);
  };

  if (error) {
    return <Alert message={error} />;
  }

  if (!details) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={styles.card}>
      <h3>{details.name}</h3>
      <div>
        <img src={details.imgUrl} alt={details.name} />
      </div>
      {details.soundUrl && <audio controls src={details.soundUrl} />}
      <div className={styles.details}>
        <div>
          <b>Abilities:</b> <i>{details.abilities.join(', ')}</i>
        </div>
        <div>
          <b>Weight:</b> <i>{details.weight}</i>
        </div>
        <div>
          <b>Height:</b> <i>{details.height}</i>
        </div>
        <div>
          {details.types.map((type) => (
            <TypeTag key={type} type={type.toLowerCase()} />
          ))}
        </div>
      </div>
      <button
        className={styles.close}
        onClick={handleCloseClick}
        aria-label="Close pokemon card"
      >
        ×
      </button>
    </div>
  );
};

const TypeTag = ({ type }: { type: string }) => {
  return <span className={`${styles.tag} ${styles[type] || ''}`}>{type}</span>;
};

export default PokemonCard;
