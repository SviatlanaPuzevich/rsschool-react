import React from 'react';
import styles from './main.layout.module.css';
import { NavLink } from 'react-router-dom';

class MainLayout extends React.Component<{ children?: React.ReactNode }> {
  render() {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <NavLink
              to="/"
              end
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              Pokemon Search
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? `${styles.link} ${styles.activeLink}` : styles.link
              }
            >
              About creators
            </NavLink>
          </nav>
        </header>
        <main>{this.props.children}</main>
      </div>
    );
  }
}

export default MainLayout;
