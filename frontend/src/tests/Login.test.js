import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component', () => {
  test('renders login page', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByText('ログイン')).toBeInTheDocument();
  });

  test('renders login form elements', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByText('メールアドレス')).toBeInTheDocument();
    expect(screen.getByText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ログイン' })).toBeInTheDocument();
  });

  test('renders home page link', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByText('ホームに戻る')).toBeInTheDocument();
  });
});