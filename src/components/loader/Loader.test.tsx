import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  it('should render loading', () => {
    render(<Loader />);

    const loader = screen.getByText(/Loading/i);

    expect(loader).toBeInTheDocument();
  });
});
