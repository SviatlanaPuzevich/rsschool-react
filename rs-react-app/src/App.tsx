import {Component} from "react";
import SearchBar from "./components/SearchBar.tsx";
import SearchResult from "./components/SearchResult";

interface AppState {
    query: string;
}


class App extends Component<{ }, AppState> {

    state: AppState = {
        query: localStorage.getItem("query") || "",
    };

    handleSearchSubmit = (query: string) => {
        console.log("Ищем покемона:", query);
        if (this.state.query) {}
        localStorage.setItem("query", this.state.query);
    };

    handleQueryChange = (
        value: string
    ) => {
        this.setState({
            query: value,
        });
    };

    render() {
        return (
            <>
                <h1>Pokemon search</h1>
                <SearchBar onQueryChange={this.handleQueryChange} query={this.state.query}
                           onSearch={this.handleSearchSubmit}/>
                <section>
                    <SearchResult/>
                </section>
            </>
        )
    }
}

export default App;


