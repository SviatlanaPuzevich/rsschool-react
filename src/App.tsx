import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.tsx';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.tsx';
import SearchPage from './pages/searchPage/SearchPage.tsx';
import AboutPage from './pages/about/AboutPage.tsx';
import NotFoundPage from './pages/notFound/NotFoundPage.tsx';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default App;
