'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useUpdateSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams.toString());

  const setParam = (key: string, value: string) => {
    currentParams.set(key, value);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const deleteParam = (key: string) => {
    currentParams.delete(key);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return {
    searchParams,
    setParam,
    deleteParam,
  };
};
