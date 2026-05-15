import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.tsx';
import MainLayout from './layouts/main/MainLayout.tsx';
import SearchPage from './pages/searchPage/SearchPage.tsx';
import AboutPage from './pages/about/AboutPage.tsx';
import NotFoundPage from './pages/notFound/NotFoundPage.tsx';
import EmptyLayout from './layouts/empty/EmptyLayout.tsx';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
            <Route element={<EmptyLayout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>

        </MainLayout>
      </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default App;
