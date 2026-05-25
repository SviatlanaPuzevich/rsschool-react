import { useParams, NavLink } from 'react-router-dom';
import { BASE_ROUTE, ABOUT, SEARCH } from '../../constants/routing.ts';
import styles from './header.module.css';
import ThemeToggle from '../themeToggle/ThemeToggle.tsx';

const Header = () => {
  const { page = '1' } = useParams<{ page: string }>();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to={`${BASE_ROUTE}${SEARCH}/${page}`}
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? `${styles.link} ${styles.activeLink}` : styles.link
          }
        >
          Pokemon Search
        </NavLink>
        <NavLink
          to={`${BASE_ROUTE}${ABOUT}`}
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? `${styles.link} ${styles.activeLink}` : styles.link
          }
        >
          About creators
        </NavLink>
      </nav>
      <div className={styles.theme}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
