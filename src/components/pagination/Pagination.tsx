'use client';

import { useTranslations } from 'next-intl';
import styles from './pagination.module.css';
import { getActiveLinkClasses } from '@/util/linkHelper';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';

interface Props {
  count: number;
  currentPage: number;
}

const Pagination = ({ count, currentPage }: Props) => {
  const t = useTranslations('Pagination');
  const { updateParams } = useUpdateSearchParams();

  if (count <= 1) {
    return null;
  }

  const updatePage = (page: number): void => {
    updateParams({
      page: page <= 1 ? null : page.toString(),
      id: null,
    });
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
    <nav className={styles.pagination} aria-label={t('label')}>
      <button
        type="button"
        className={`${styles.link} ${styles.back}`}
        disabled={currentPage === 1}
        onClick={() => updatePage(currentPage - 1)}
        aria-label={t('previous')}
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
        aria-label={t('next')}
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
