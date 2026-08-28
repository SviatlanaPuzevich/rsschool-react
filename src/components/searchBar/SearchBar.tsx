import React from 'react';
import Button from '../button/Button';
import styles from './search.bar.module.css';
import { useTranslations } from 'next-intl';

interface SearchInputProps {
  query: string;
  onSearch: () => void;
  onQueryChange: (value: string) => void;
  onError: () => void;
}

const SearchBar: React.FC<SearchInputProps> = ({
  query,
  onSearch,
  onQueryChange,
  onError,
}) => {
  const t = useTranslations('Search');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onQueryChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <section className={styles.container}>
      <input
        id="query"
        type="text"
        onChange={handleChange}
        value={query}
        onKeyDown={handleKeyDown}
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
      />
      <Button text={t('search')} onClick={onSearch} buttonType="primary" />
      <Button
        onClick={onError}
        text={t('generateException')}
        buttonType="danger"
      />
    </section>
  );
};

export default SearchBar;
