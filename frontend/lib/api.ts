const API_BASE_URL = 'http://localhost:8000/api';

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

class ApiService {
  private baseUrl = API_BASE_URL;

  // Helper method to make fetch requests
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-2xx responses
      if (!response.ok) {
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

  // Get all items
  async getItems(): Promise<Item[]> {
    return this.request<Item[]>('/items');
  }

  // Get a single item by ID
  async getItem(id: number): Promise<Item> {
    return this.request<Item>(`/items/${id}`);
  }

  // Create a new item
  async createItem(itemData: CreateItemData): Promise<Item> {
    return this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  }

  // Update an existing item
  async updateItem(id: number, itemData: UpdateItemData): Promise<Item> {
    return this.request<Item>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  }

  // Delete an item
  async deleteItem(id: number): Promise<void> {
    return this.request<void>(`/items/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
