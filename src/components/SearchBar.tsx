import React from 'react';
import Button from './Button.tsx';
import styles from './search.bar.module.css';

interface SearchInputProps {
  query: string;
  onSearch: () => void;
  onQueryChange: (value: string) => void;
  onError: () => void;
}

class SearchBar extends React.Component<SearchInputProps> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onQueryChange(e.target.value);
  };

  render() {
    return (
      <section className={styles.section}>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.props.query}
          placeholder="Enter pokemon name..."
        />
        <Button value="Search" onClick={this.props.onSearch} />
        <button onClick={this.props.onError} className={styles.errorButton}>
          Generate Exception
        </button>
      </section>
    );
  }
}

export default SearchBar;
