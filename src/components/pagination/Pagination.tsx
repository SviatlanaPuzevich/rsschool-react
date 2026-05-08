import React from 'react';
import styles from './pagination.module.css';

interface Props {
  count: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

class Pagination extends React.Component<Props> {
  handlePageChange = (event: React.MouseEvent, page: number) => {
    event.preventDefault();
    this.props.onPageChange(page);
  };

  render() {
    const { count, currentPage } = this.props;

    if (count <= 1) {
      return null;
    }

    const pages = Array.from({ length: count }, (_, index) => index + 1);

    return (
      <div className={styles.pagination}>
        {pages.map((page) => {
          return (
            <a
              key={page}
              href="#"
              className={page === currentPage ? styles.activePage : styles.page}
              onClick={(e) => this.handlePageChange(e, page)}
            >
              {page}
            </a>
          );
        })}
      </div>
    );
  }
}

export default Pagination;
