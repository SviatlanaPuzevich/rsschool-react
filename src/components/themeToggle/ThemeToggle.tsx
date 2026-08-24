'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';
import styles from './themeToggle.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('Theme');

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={t('label')}
      suppressHydrationWarning={true}
    >
      {theme === 'light' ? t('toDark') : t('toLight')}
    </button>
  );
};

export default ThemeToggle;
