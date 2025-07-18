import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubHeader from '../../components/SubHeader';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SubHeader Component', () => {
  test('renders all navigation items', () => {
    renderWithRouter(<SubHeader />);
    
    expect(screen.getByText('出勤者')).toBeInTheDocument();
    expect(screen.getByText('福利厚生委員会')).toBeInTheDocument();
    expect(screen.getByText('意見箱')).toBeInTheDocument();
    expect(screen.getByText('掲示板')).toBeInTheDocument();
    expect(screen.getByText('社員名簿')).toBeInTheDocument();
    expect(screen.getByText('監査ページ')).toBeInTheDocument();
    expect(screen.getByText('お気に入りに追加')).toBeInTheDocument();
    expect(screen.getByText('お問い合わせ')).toBeInTheDocument();
  });

  test('navigation items have correct href attributes', () => {
    renderWithRouter(<SubHeader />);
    
    expect(screen.getByText('出勤者').closest('a')).toHaveAttribute('href', '/attendance');
    expect(screen.getByText('福利厚生委員会').closest('a')).toHaveAttribute('href', '/welfare');
    expect(screen.getByText('意見箱').closest('a')).toHaveAttribute('href', '/suggestions');
  });
});