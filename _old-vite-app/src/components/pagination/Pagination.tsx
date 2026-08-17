import styles from './pagination.module.css';
import { getActiveLinkClasses } from '../../util/linkHelper.ts';
import { useUpdateSearchParams } from '../../hooks/useUpdateSearchParams.ts';

interface Props {
  count: number;
}

const Pagination = ({ count }: Props) => {
  const { searchParams, deleteParam, setParam } = useUpdateSearchParams();

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);

  if (count <= 1) {
    return null;
  }

  const updatePage = (page: number): void => {
    if (page <= 1) {
      deleteParam('page');
    } else {
      setParam('page', page.toString());
    }

    deleteParam('details');
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
        className={`${styles.link} ${styles.back}`}
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
          className={getActiveLinkClasses(page === currentPage, styles)}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => updatePage(page)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        className={`${styles.link} ${styles.forward}`}
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
