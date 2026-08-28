import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Loader from '@/components/loader/Loader';
import SearchPage from './SearchPage';

type Props = {
  params: Promise<{ locale: string }>;
};

const Page = async ({ params }: Props) => {
  const { locale } = await params;

  setRequestLocale(locale as Locale);

  // `SearchPage` reads the query string, which needs a suspense boundary
  // so that the surrounding page can still be prerendered.
  return (
    <Suspense fallback={<Loader />}>
      <SearchPage />
    </Suspense>
  );
};

export default Page;
