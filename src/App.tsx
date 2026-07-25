import { Component } from 'react';
import MainLayout from './layouts/MainLayout.tsx';
import SearchPage from './pages/SearchPage.tsx';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.tsx';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <MainLayout>
          <SearchPage />
        </MainLayout>
      </ErrorBoundary>
    );
  }
}

export default App;
