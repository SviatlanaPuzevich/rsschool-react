import styles from './main.layout.module.css';
import { NavLink, Outlet } from 'react-router-dom';
import { BASE_ROUTE, HOME, ABOUT } from '../../constants/routing.ts';

const MainLayout = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <NavLink
            to={BASE_ROUTE + HOME}
            end
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            Pokemon Search
          </NavLink>
          <NavLink
            to={BASE_ROUTE + ABOUT}
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? `${styles.link} ${styles.activeLink}` : styles.link
            }
          >
            About creators
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
