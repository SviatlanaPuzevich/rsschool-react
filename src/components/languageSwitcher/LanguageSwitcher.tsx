'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, {
      locale: event.target.value,
    });
  };

  return (
    <select value={locale} onChange={handleChange}>
      <option value="en">English</option>
      <option value="ru">Русский</option>
    </select>
  );
}
