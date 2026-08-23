'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './header.module.css';
import ThemeToggle from '../themeToggle/ThemeToggle';
import { getActiveLinkClasses } from '@/util/linkHelper';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link
          href="/search"
          className={getActiveLinkClasses(pathname === '/search', styles)}
        >
          Pokemon Search
        </Link>

        <Link
          href="/about"
          className={getActiveLinkClasses(pathname === '/about', styles)}
        >
          About creators
        </Link>
      </nav>
      <LanguageSwitcher />
      <div className={styles.theme}>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
