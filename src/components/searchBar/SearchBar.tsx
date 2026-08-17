import React from 'react';
import Button from '../button/Button';
import styles from './search.bar.module.css';

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
        placeholder="Enter pokemon name..."
      />
      <Button text="Search" onClick={onSearch} buttonType="primary" />
      <Button onClick={onError} text="Generate Exception" buttonType="danger" />
    </section>
  );
};

export default SearchBar;
