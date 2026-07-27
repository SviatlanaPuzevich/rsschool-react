import { NavLink } from 'react-router-dom';
import styles from './header.module.css';

const Header = () => {

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to={`/search`}
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? `${styles.link} ${styles.activeLink}` : styles.link
          }
        >
          Pokemon Search
        </NavLink>
        <NavLink
          to={`/about`}
          className={({ isActive }: { isActive: boolean }) =>
            isActive ? `${styles.link} ${styles.activeLink}` : styles.link
          }
        >
          About creators
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
