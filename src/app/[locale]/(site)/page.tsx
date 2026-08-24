import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Loader from '@/components/loader/Loader';
import SearchPage from './search/SearchPage';

type Props = {
  params: Promise<{ locale: string }>;
};

const HomePage = async ({ params }: Props) => {
  const { locale } = await params;

  setRequestLocale(locale as Locale);

  return (
    <Suspense fallback={<Loader />}>
      <SearchPage />
    </Suspense>
  );
};

export default HomePage;
