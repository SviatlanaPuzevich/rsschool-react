import  {Component} from "react";
import SearchInput from "./components/SearchInput";
import SearchButton from "./components/SearchButton";
import SearchResult from "./components/SearchResult";

class App extends Component {

    handleSearchSubmit = (query: string) => {
        console.log("Ищем покемона:", query);
    };

    handleSearchChange = (query: string) => {
        console.log("Ищем покемона:", query);
    };

    render() {
        return (
            <>
                <h1>Pokemon search</h1>
                <section>
                    <SearchInput onChange={this.handleSearchChange} value=""/>
                    <SearchButton/>
                </section>
                <section>
                    <SearchResult/>
                </section>
            </>
        )
    }
}

export default App;


