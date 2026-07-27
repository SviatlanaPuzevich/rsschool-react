import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/main/MainLayout.tsx';
import SearchPage from './pages/searchPage/SearchPage.tsx';
import AboutPage from './pages/about/AboutPage.tsx';
import NotFoundPage from './pages/notFound/NotFoundPage.tsx';
import EmptyLayout from './layouts/empty/EmptyLayout.tsx';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.tsx';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<SearchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
          <Route element={<EmptyLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
