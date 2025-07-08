const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface CreateItemData {
  name: string;
  description: string;
  price: number;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  price?: number;
}

// Authentication interfaces
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}

class ApiService {
  private baseUrl = API_BASE_URL;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  // Token management methods
  setTokens(tokens: AuthTokens) {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Helper method to make fetch requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if authenticated and required
    if (requireAuth && this.accessToken) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.accessToken}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-2xx responses
      if (!response.ok) {
        // If unauthorized and we have a refresh token, try to refresh
        if (response.status === 401 && this.refreshToken && requireAuth) {
          try {
            await this.refreshAccessToken();
            // Retry the original request with new token
            config.headers = {
              ...config.headers,
              'Authorization': `Bearer ${this.accessToken}`,
            };
            const retryResponse = await fetch(url, config);
            if (!retryResponse.ok) {
              throw new Error('Authentication failed');
            }
            if (retryResponse.status === 204) {
              return undefined as T;
            }
            return await retryResponse.json();
          } catch {
            // Refresh failed, clear tokens and throw error
            this.clearTokens();
            throw new Error('Session expired. Please log in again.');
          }
        }

        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error || 
                       errorData.errors?.join(', ') || 
                       `HTTP error! status: ${response.status}`;
        throw new Error(message);
      }

      // Handle 204 No Content responses (like DELETE)
      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Authentication methods
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setTokens({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });

    // Store user info
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.setTokens({
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });

    // Store user info
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout(): Promise<void> {
    if (this.accessToken) {
      try {
        await this.request<void>('/auth/logout', {
          method: 'DELETE',
        }, true);
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
    }
    
    this.clearTokens();
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.refreshToken}`,
      },
    });

    this.accessToken = response.access_token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.access_token);
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<{ user: User }>('/auth/me', {}, true).then(response => response.user);
  }

  // Get stored user from localStorage
  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Get all items (requires authentication)
  async getItems(): Promise<Item[]> {
    return this.request<Item[]>('/items', {}, true);
  }

  // Get a single item by ID (requires authentication)
  async getItem(id: number): Promise<Item> {
    return this.request<Item>(`/items/${id}`, {}, true);
  }

  // Create a new item (requires authentication)
  async createItem(itemData: CreateItemData): Promise<Item> {
    return this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    }, true);
  }

  // Update an existing item (requires authentication)
  async updateItem(id: number, itemData: UpdateItemData): Promise<Item> {
    return this.request<Item>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    }, true);
  }

  // Delete an item (requires authentication)
  async deleteItem(id: number): Promise<void> {
    return this.request<void>(`/items/${id}`, {
      method: 'DELETE',
    }, true);
  }
}

export const apiService = new ApiService();
