import { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/main/MainLayout.tsx';
import SearchPage from './pages/searchPage/SearchPage.tsx';
import AboutPage from './pages/about/AboutPage.tsx';
import NotFoundPage from './pages/notFound/NotFoundPage.tsx';
import { BASE_ROUTE, ABOUT } from './constants/routing.ts';
import EmptyLayout from './layouts/empty/EmptyLayout.tsx';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.tsx';
import PokemonCard from './components/pokemonCard/PokemonCard.tsx';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path={BASE_ROUTE + '/:page'} element={<SearchPage />}>
                <Route path="?/:pokemonId" element={<PokemonCard />} />
              </Route>
              <Route path={BASE_ROUTE + ABOUT} element={<AboutPage />} />
            </Route>
            <Route element={<EmptyLayout />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    );
  }
}

export default App;
