import {RouterProvider} from 'react-router-dom';
import {router} from './router.tsx';
import ThemeProvider from './context/ContextThemeProvider.tsx';
import './styles/theme.css';
import {queryClient} from './lib/queryClient.ts';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const App = () => {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>;
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default App;
