import {
  Routes,
  Route,
  Navigate,
  HashRouter,
} from 'react-router-dom';
import MainLayout from './layouts/main/MainLayout.tsx';
import SearchPage from './pages/searchPage/SearchPage.tsx';
import AboutPage from './pages/about/AboutPage.tsx';
import NotFoundPage from './pages/notFound/NotFoundPage.tsx';
import { BASE_ROUTE, ABOUT, SEARCH } from './constants/routing.ts';
import EmptyLayout from './layouts/empty/EmptyLayout.tsx';
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.tsx';
import PokemonCard from './components/pokemonCard/PokemonCard.tsx';
import ThemeProvider from './context/ContextThemeProvider.tsx';
import './styles/theme.css';
import { queryClient } from './lib/queryClient.ts';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route
                  path="/"
                  element={<Navigate to={`${BASE_ROUTE}${SEARCH}/1`} replace />}
                />
                <Route
                  path={BASE_ROUTE}
                  element={<Navigate to={`${BASE_ROUTE}${SEARCH}/1`} replace />}
                />
                <Route
                  path={`${BASE_ROUTE}${SEARCH}/:page`}
                  element={<SearchPage />}
                >
                  <Route path=":pokemonId" element={<PokemonCard />} />
                </Route>
                <Route path={`${BASE_ROUTE}${ABOUT}`} element={<AboutPage />} />
              </Route>
              <Route element={<EmptyLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </HashRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
