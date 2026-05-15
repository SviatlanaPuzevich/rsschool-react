import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/main/MainLayout.tsx';
import SearchPage from './pages/searchPage/SearchPage.tsx';
import AboutPage from './pages/about/AboutPage.tsx';
import NotFoundPage from './pages/notFound/NotFoundPage.tsx';
import { BASE_ROUTE, HOME, ABOUT } from './constants/routing.ts';
import EmptyLayout from './layouts/empty/EmptyLayout.tsx';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={BASE_ROUTE + HOME} element={<SearchPage />} />
            <Route path={BASE_ROUTE + ABOUT} element={<AboutPage />} />
          </Route>
          <Route element={<EmptyLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
