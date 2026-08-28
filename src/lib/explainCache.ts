type CacheValue = {
  explanation: string;
  createdAt: number;
};

const cache = new Map<string, CacheValue>();

export function cacheKey(id: number | string, locale: string) {
  return `${id}:${locale}`;
}

export const explainCache = {
  get(id: number | string, locale: string): CacheValue | undefined {
    return cache.get(cacheKey(id, locale));
  },
  set(id: number | string, locale: string, explanation: string) {
    cache.set(cacheKey(id, locale), { explanation, createdAt: Date.now() });
  },
  delete(id: number | string, locale: string) {
    cache.delete(cacheKey(id, locale));
  },
  clear() {
    cache.clear();
  },
};
