import { NavLink } from 'react-router-dom';
import styles from './header.module.css';
import ThemeToggle from '../themeToggle/ThemeToggle.tsx';
import { getActiveLinkClasses } from '../../util/linkHelper.ts';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to={`/search`}
          className={({ isActive }) => getActiveLinkClasses(isActive, styles)}
        >
          Pokemon Search
        </NavLink>
        <NavLink
          to={`/about`}
          className={({ isActive }) => getActiveLinkClasses(isActive, styles)}
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
