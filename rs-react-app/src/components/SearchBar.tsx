import React, {ChangeEvent} from 'react';
import Button from "./Button.tsx";

interface SearchInputProps {
    query: string;
    onSearch: () => void;
    onQueryChange: (value: string) => void;
}

class SearchBar extends React.Component<SearchInputProps> {

    handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        this.props.onQueryChange(e.target.value)
    }


    render() {
        return (
            <section>
                <input type="text"
                       onChange={this.handleChange}
                       value={this.props.query}
                       placeholder='Enter pokemon name...'
                />
                <Button value="Search" onClick={this.props.onSearch}/>
            </section>
        );
    }
}

export default SearchBar;