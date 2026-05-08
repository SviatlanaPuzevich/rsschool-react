import { Component } from 'react';
import MainLayout from './layouts/MainLayout.tsx';
import SearchPage from './pages/SearchPage.tsx';

class App extends Component<{}> {
  render() {
    return (
      <MainLayout>
        <SearchPage />
      </MainLayout>
    );
  }
}

export default App;
