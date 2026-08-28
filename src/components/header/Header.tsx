'use client';

import { useTranslations } from 'next-intl';
import styles from './header.module.css';
import ThemeToggle from '../themeToggle/ThemeToggle';
import { getActiveLinkClasses } from '@/util/linkHelper';
import LanguageSwitcher from '@/components/languageSwitcher/LanguageSwitcher';
import { Link, usePathname } from '@/i18n/routing';

const Header = () => {
  // Locale-aware: returns the pathname without the locale prefix.
  const pathname = usePathname();
  const t = useTranslations('Header');

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link
          href="/search"
          className={getActiveLinkClasses(
            pathname === '/search' || pathname === '/',
            styles
          )}
        >
          {t('search')}
        </Link>

        <Link
          href="/about"
          className={getActiveLinkClasses(pathname === '/about', styles)}
        >
          {t('about')}
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
