import { apiService } from '../../lib/api';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('isAuthenticated returns false when no token', () => {
    localStorageMock.getItem.mockReturnValue(null);
    expect(apiService.isAuthenticated()).toBe(false);
  });

  test('isAuthenticated returns true when token exists', () => {
    // We need to set the token through the service, not just mock localStorage
    // because the service loads tokens at construction time
    apiService.setTokens({
      access_token: 'test-token',
      refresh_token: 'test-refresh-token',
    });
    expect(apiService.isAuthenticated()).toBe(true);
  });

  test('getStoredUser returns parsed user data', () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    const user = apiService.getStoredUser();
    expect(user).toEqual(mockUser);
  });

  test('clearTokens removes all tokens and user data', () => {
    apiService.clearTokens();
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
  });

  test('login makes correct API call and stores tokens', async () => {
    const mockResponse = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      user: { id: 1, email: 'test@example.com', name: 'Test User' },
    };

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await apiService.login({ email: 'test@example.com', password: 'password' });

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'test-access-token');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', 'test-refresh-token');
    expect(result).toEqual(mockResponse);
  });
});

