import React from 'react';
import styles from './pagination.module.css';

interface Props {
  count: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ count, currentPage, onPageChange }: Props) => {
  if (count <= 1) return null;

  const handlePageChange = (event: React.MouseEvent, page: number) => {
    event.preventDefault();
    onPageChange(page);
  };

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
      <button
        disabled={currentPage === 1}
        className={styles.button}
        onClick={(e) => handlePageChange(e, currentPage - 1)}
        aria-label="back to previous page"
      >
        &lt;
      </button>

      {pages.map((page) => (
        <a
          key={page}
          href="#"
          className={page === currentPage ? styles.activePage : styles.page}
          onClick={(e) => handlePageChange(e, page)}
        >
          {page}
        </a>
      ))}

      <button
        disabled={currentPage === count}
        className={styles.button}
        onClick={(e) => handlePageChange(e, currentPage + 1)}
        aria-label="forward to next page"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
