import { useSearchParams } from 'react-router-dom';
import styles from './pagination.module.css';

interface Props {
  count: number;
}

const Pagination: React.FC<Props> = ({ count }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

  if (count <= 1) {
    return null;
  }

  const updatePage = (page: number): void => {
    const params = new URLSearchParams(searchParams);

    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }

    setSearchParams(params);
  };

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(count, currentPage + 2);

  if (currentPage <= 3) {
    endPage = Math.min(count, 5);
  } else if (currentPage >= count - 2) {
    startPage = Math.max(1, count - 4);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.button}
        disabled={currentPage === 1}
        onClick={() => updatePage(currentPage - 1)}
        aria-label="Previous page"
      >
        &lt;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? styles.activeLink : styles.link}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => updatePage(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={styles.button}
        disabled={currentPage === count}
        onClick={() => updatePage(currentPage + 1)}
        aria-label="Next page"
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
