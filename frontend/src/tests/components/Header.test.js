import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';
import { AuthProvider } from '../../contexts/AuthContext';

const mockUser = {
  id: 1,
  name: '田中太郎',
  email: 'tanaka@company.com',
  department: 'IT部',
  position: 'マネージャー'
};

const MockAuthProvider = ({ children, user = mockUser }) => {
  const value = {
    user,
    logout: jest.fn(),
    isAuthenticated: !!user
  };
  
  return (
    <AuthProvider value={value}>
      {children}
    </AuthProvider>
  );
};

describe('Header Component', () => {
  test('renders user name correctly', () => {
    render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    );
    
    expect(screen.getByText('田中太郎さんのページ')).toBeInTheDocument();
    expect(screen.getByText('IT部')).toBeInTheDocument();
    expect(screen.getByText('マネージャー')).toBeInTheDocument();
  });

  test('renders today\'s date', () => {
    render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    );
    
    expect(screen.getByText(/今日の日付:/)).toBeInTheDocument();
  });

  test('renders calendar link', () => {
    render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    );
    
    expect(screen.getByText('📅 カレンダー')).toBeInTheDocument();
  });

  test('renders logout button', () => {
    render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    );
    
    expect(screen.getByText('ログアウト')).toBeInTheDocument();
  });
});