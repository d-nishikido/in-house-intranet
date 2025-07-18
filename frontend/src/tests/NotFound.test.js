import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFound Component', () => {
  test('renders 404 page', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('ページが見つかりません')).toBeInTheDocument();
  });

  test('renders home page link', () => {
    renderWithRouter(<NotFound />);
    
    expect(screen.getByText('ホームに戻る')).toBeInTheDocument();
  });
});