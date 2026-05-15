import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';

const renderWithRouter = (initialEntries = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/:page?" element={<Header />} />
                <Route path="/about" element={<Header />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('Header Component', () => {
    it('should render navigation links correctly', () => {
        renderWithRouter(['/1']);

        const searchLink = screen.getByRole('link', { name: /pokemon search/i });
        const aboutLink = screen.getByRole('link', { name: /about creators/i });

        expect(searchLink).toBeInTheDocument();
        expect(aboutLink).toBeInTheDocument();
    });

    it('should insert the current page into the search link href', () => {
        renderWithRouter(['/5']);

        const searchLink = screen.getByRole('link', { name: /pokemon search/i });

        expect(searchLink.getAttribute('href')).toBe('/5');
    });

    it('should use page 1 as default if there is no page parameter in the URL', () => {
        renderWithRouter(['/']);

        const searchLink = screen.getByRole('link', { name: /pokemon search/i });
        expect(searchLink.getAttribute('href')).toBe('/1');
    });

    it('should add the active link class to the current route', () => {
        renderWithRouter(['/about']);

        const aboutLink = screen.getByRole('link', { name: /about creators/i });
        const searchLink = screen.getByRole('link', { name: /pokemon search/i });

        expect(aboutLink.className).toContain('activeLink');
        expect(searchLink.className).not.toContain('activeLink');
    });
});