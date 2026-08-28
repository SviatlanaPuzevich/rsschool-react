import { notFound } from 'next/navigation';

/**
 * Unknown paths below a locale would otherwise fall back to the global
 * `app/not-found.tsx` (which has no locale context). This catch-all keeps them
 * inside the `[locale]` segment so `app/[locale]/not-found.tsx` is rendered
 * with the correct language.
 */
const CatchAllPage = () => {
  notFound();
};

export default CatchAllPage;
