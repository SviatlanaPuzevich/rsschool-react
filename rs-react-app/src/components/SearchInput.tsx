import React, { ChangeEvent } from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

class SearchInput extends React.Component<SearchInputProps> {


    private handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(event.target.value);
    };

    render() {
        return (
            <input
                className="search-input"
                onChange={this.handleInputChange}
                value={this.props.value}
                placeholder='Search...'
            />
        );
    }
}

export default SearchInput;