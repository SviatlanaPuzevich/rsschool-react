import styles from './pagination.module.css';
import { NavLink, Link, useParams } from 'react-router-dom';
import { BASE_ROUTE } from '../../constants/routing.ts';

interface Props {
  count: number;
}

const Pagination = ({ count }: Props) => {
  const params = useParams<{ page: string }>();
  const currentPage = Number(params.page) || 1;

  if (count <= 1) return null;

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(count, currentPage + 2);

  if (currentPage <= 3) {
    end = Math.min(count, 5);
  } else if (currentPage > count - 2) {
    start = Math.max(1, count - 4);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.pagination}>
      <Link
        to={BASE_ROUTE + `/${currentPage - 1}`}
        className={`${styles.button} ${currentPage === 1 ? styles.disabled : ''}`}
      >
        &lt;
      </Link>

      {pages.map((page) => (
        <NavLink
          key={page}
          to={BASE_ROUTE + `/${page}`}
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? `${styles.link} ${styles.activeLink}` : styles.link
          }
        >
          {page}
        </NavLink>
      ))}

      <Link
        to={BASE_ROUTE + `/${currentPage + 1}`}
        className={`${styles.button} ${currentPage === count ? styles.disabled : ''}`}
      >
        &gt;
      </Link>
    </div>
  );
};

export default Pagination;
