'use client';

import React, { useEffect, useState } from 'react';
import Button from '../button/Button';
import styles from './search.bar.module.css';
import { useTranslations } from 'next-intl';
import { useUpdateSearchParams } from '@/hooks/useUpdateSearchParams';

interface SearchInputProps {
  initialQuery: string;
}

const SearchBar: React.FC<SearchInputProps> = ({ initialQuery }) => {
  const t = useTranslations('Search');
  const { searchParams, updateParams } = useUpdateSearchParams();

  const [inputValue, setInputValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = localStorage.getItem('query');
      const currentUrlQuery = new URLSearchParams(window.location.search).get(
        'query'
      );
      if (!currentUrlQuery && savedQuery) {
        return savedQuery;
      }
    }
    return initialQuery;
  });

  const [generateError, setGenerateError] = useState(false);

  const triggerServerSearch = (searchQuery: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('query', searchQuery);
    }

    updateParams({
      query: searchQuery || null,
      page: '1',
      id: null,
    });
  };

  useEffect(() => {
    const savedQuery = localStorage.getItem('query');
    const currentUrlQuery = searchParams.get('query');

    if (!currentUrlQuery && savedQuery) {
      updateParams({
        query: savedQuery,
        page: '1',
        id: null,
      });
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerServerSearch(inputValue);
    }
  };

  if (generateError) {
    throw new Error('Test exception for Error Boundary!');
  }

  return (
    <section className={styles.container}>
      <input
        id="query"
        type="text"
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
      />
      <Button
        text={t('search')}
        onClick={() => triggerServerSearch(inputValue)}
        buttonType="primary"
      />
      <Button
        onClick={() => setGenerateError(true)}
        text={t('generateException')}
        buttonType="danger"
      />
    </section>
  );
};

export default SearchBar;
