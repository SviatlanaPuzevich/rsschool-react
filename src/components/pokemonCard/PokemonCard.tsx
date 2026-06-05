import styles from './pokemon.card.module.css';
import Alert from '../error/Alert.tsx';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader.tsx';
import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '../../services/pokemon.ts';

const PokemonCard = () => {
  const navigate = useNavigate();
  const { pokemonId } = useParams<{
    pokemonId: string | undefined;
  }>();
  const {
    data: details = null,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pokemonDetail', pokemonId],
    queryFn: () => pokemonService.getById(pokemonId!),
    enabled: !!pokemonId,
  });

  const handleCloseClick = () => {
    navigate('..', { relative: 'path' });
  };

  if (isError) {
    return <Alert message={error.message} />;
  }

  if (isLoading) {
    return <Loader />;
  }


  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{details.name}</h3>
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
