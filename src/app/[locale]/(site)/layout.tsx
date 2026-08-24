import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import styles from './main.layout.module.css';
import { Providers } from '@/app/providers';
import Header from '@/components/header/Header';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const SiteLayout = async ({ children, params }: Props) => {
  const { locale } = await params;

  // The parent `[locale]` layout already rejected unknown locales.
  setRequestLocale(locale as Locale);

  return (
    <Providers>
      <Header />
      <div className={styles.layout}>
        <aside />
        <main>{children}</main>
        <aside />
      </div>
    </Providers>
  );
};

export default SiteLayout;
