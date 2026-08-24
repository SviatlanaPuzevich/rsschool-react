'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname, routing, type Locale } from '@/i18n/routing';
import styles from './languageSwitcher.module.css';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;

    // Keep the current query string (page/details/...) when switching locales.
    const search =
      typeof window === 'undefined' ? '' : window.location.search;

    startTransition(() => {
      router.replace(`${pathname}${search}`, { locale: nextLocale });
    });
  };

  return (
    <label className={styles.switcher}>
      <span className={styles.label}>{t('label')}</span>
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        aria-label={t('label')}
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {t(item)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
