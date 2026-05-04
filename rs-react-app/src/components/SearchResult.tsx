import {Component} from "react";

interface SearchResultProps {
    onSearch?: (query: string) => void; // Опциональный колбэк, принимает строку
}

interface SearchResultState {
    query: string;
}

class SearchResult extends Component<SearchResultProps, SearchResultState> {


    render() {
        return (
            <ul></ul>
        )
    }
}


export default SearchResult;