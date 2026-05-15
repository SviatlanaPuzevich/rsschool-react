import React, { useState } from 'react';
import Button from '../button/Button.tsx';
import styles from './search.bar.module.css';

interface SearchInputProps {
  query: string;
  onSearch: () => void;
  onQueryChange: (value: string) => void;
}

const SearchBar = ({ query, onSearch, onQueryChange }: SearchInputProps) => {
  const [generateError, setGenerateError] = useState<boolean>(false);

  if (generateError) {
    throw new Error('This error was generated');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
  };

  return (
    <section className={styles.container}>
      <input
        id="query"
        type="text"
        onChange={handleChange}
        value={query}
        placeholder="Enter pokemon name..."
      />
      <Button value="Search" onClick={onSearch} buttonType="primary" />
      <Button
        onClick={() => setGenerateError(true)}
        value="Generate Exception"
        buttonType="danger"
      />
    </section>
  );
};

export default SearchBar;
