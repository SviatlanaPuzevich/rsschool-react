import React from 'react';
import Button from '../button/Button.tsx';
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
      <section className={styles.container}>
        <input
          id="query"
          type="text"
          onChange={this.handleChange}
          value={this.props.query}
          placeholder="Enter pokemon name..."
        />
        <Button
          text="Search"
          onClick={this.props.onSearch}
          buttonType="primary"
        />
        <Button
          onClick={this.props.onError}
          text="Generate Exception"
          buttonType="danger"
        />
      </section>
    );
  }
}

export default SearchBar;
