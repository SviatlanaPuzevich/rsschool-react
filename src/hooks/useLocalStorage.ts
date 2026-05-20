import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue;

      localStorage.setItem(key, JSON.stringify(resolved));

      return resolved;
    });
  };

  return [value, setStoredValue] as const;
}
