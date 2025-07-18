import authService from '../../services/authService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    test('should login successfully and store token', async () => {
      const mockResponse = {
        data: {
          token: 'mock-token',
          user: {
            id: 1,
            name: '田中太郎',
            email: 'tanaka@company.com'
          }
        }
      };
      
      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await authService.login('tanaka@company.com', 'password123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/login',
        {
          email: 'tanaka@company.com',
          password: 'password123'
        }
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
      expect(result).toEqual(mockResponse.data);
    });

    test('should throw error with server error message', async () => {
      const errorResponse = {
        response: {
          data: {
            error: 'Invalid credentials'
          }
        }
      };
      
      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(authService.login('invalid@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });

    test('should throw network error message', async () => {
      const networkError = {
        code: 'NETWORK_ERROR'
      };
      
      mockedAxios.post.mockRejectedValue(networkError);

      await expect(authService.login('test@example.com', 'password')).rejects.toThrow('ネットワークエラー: サーバーに接続できません');
    });
  });

  describe('logout', () => {
    test('should remove token and user from localStorage', () => {
      authService.logout();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('getCurrentUser', () => {
    test('should return user from localStorage', () => {
      const mockUser = { id: 1, name: '田中太郎' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      const result = authService.getCurrentUser();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUser);
    });

    test('should return null if no user in localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    test('should return true if token exists', () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');

      const result = authService.isAuthenticated();

      expect(result).toBe(true);
    });

    test('should return false if no token', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});