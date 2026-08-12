import { useSearchParams } from 'react-router-dom';

export const useUpdateSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = (key: string, value: string) => {
    if (searchParams.get(key) === value) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(key, value);
      return next;
    });
  };

  const deleteParam = (key: string) => {
    if (!searchParams.has(key)) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      return next;
    });
  };

  return { searchParams, setParam, deleteParam };
};
