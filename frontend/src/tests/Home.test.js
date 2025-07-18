import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Home from '../pages/Home';

jest.mock('axios');
const mockedAxios = axios;

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  test('renders home page with header', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<Home />);
    
    expect(screen.getByText('田中太郎さんのページ')).toBeInTheDocument();
    expect(screen.getByText(/今日の日付/)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<Home />);
    
    expect(screen.getByText('出勤者')).toBeInTheDocument();
    expect(screen.getByText('福利厚生委員会')).toBeInTheDocument();
    expect(screen.getByText('意見箱')).toBeInTheDocument();
    expect(screen.getByText('掲示板')).toBeInTheDocument();
    expect(screen.getByText('社員名簿')).toBeInTheDocument();
  });

  test('renders main content sections', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<Home />);
    
    expect(screen.getByText('お知らせ')).toBeInTheDocument();
    expect(screen.getByText('外部システムリンク')).toBeInTheDocument();
    expect(screen.getByText('書類の処理状況')).toBeInTheDocument();
  });

  test('renders external system links', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<Home />);
    
    expect(screen.getByText('健康安心コネクトアプリ')).toBeInTheDocument();
    expect(screen.getByText('HENNGE One - 送信一時保留確認')).toBeInTheDocument();
    expect(screen.getByText('HENNGE One - セキュアストレージ')).toBeInTheDocument();
    expect(screen.getByText('ANPIC - 安否確認システム')).toBeInTheDocument();
    expect(screen.getByText('Office365のページ')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<Home />);
    
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  test('displays announcements when loaded', async () => {
    const mockAnnouncements = [
      {
        id: 1,
        title: 'テストお知らせ',
        content: 'テスト内容',
        created_at: '2023-01-01T00:00:00Z'
      }
    ];
    mockedAxios.get.mockResolvedValue({ data: mockAnnouncements });
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('テストお知らせ')).toBeInTheDocument();
      expect(screen.getByText('テスト内容')).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('お知らせの取得に失敗しました')).toBeInTheDocument();
    });
  });

  test('displays document processing status', () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithRouter(<Home />);
    
    expect(screen.getByText('申請')).toBeInTheDocument();
    expect(screen.getByText('決裁（勤務届以外）')).toBeInTheDocument();
    expect(screen.getByText('決裁（勤務届）')).toBeInTheDocument();
    expect(screen.getByText('2件')).toBeInTheDocument();
    expect(screen.getByText('1件')).toBeInTheDocument();
  });
});