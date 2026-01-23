/**
 * ETHANI API Client
 * Handles all backend communication
 * - Locale-aware
 * - Error handling
 * - No blockchain calls from frontend
 */

import { BackendResponse, User, PriceInfo, MarketListing, Order, Supply, WasteRecord } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<BackendResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 - refresh token or redirect to login
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        throw new Error('Unauthorized - please log in again');
      }

      // Try to parse JSON response
      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = { success: response.ok };
      }

      if (!response.ok) {
        throw new Error(data.error || data.detail || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      
      // Provide more helpful error messages
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(
          'Network connection failed. Please check if the backend server is running and accessible.'
        );
      }
      
      throw error;
    }
  }

  // ========================
  // AUTH ENDPOINTS
  // ========================

  async login(email: string, password: string): Promise<BackendResponse<{ token: string; user: User }>> {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    region: string;
    locale: string;
  }): Promise<BackendResponse<{ token: string; user: User }>> {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async selectRoles(roles: string[]): Promise<BackendResponse<User>> {
    return this.request('/api/v1/auth/select-roles', {
      method: 'POST',
      body: JSON.stringify({ roles }),
    });
  }

  async getCurrentUser(): Promise<BackendResponse<User>> {
    return this.request('/api/v1/auth/me');
  }

  async logout(): Promise<BackendResponse<null>> {
    return this.request('/api/v1/auth/logout', {
      method: 'POST',
    });
  }

  // ========================
  // PRODUCT & PRICE ENDPOINTS
  // ========================

  async getProducts(filters?: {
    category?: string;
    region?: string;
  }): Promise<BackendResponse<PriceInfo[]>> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.region) params.append('region', filters.region);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/v1/products${query}`);
  }

  async getProductPrice(productId: number, region?: string): Promise<BackendResponse<PriceInfo>> {
    const query = region ? `?region=${region}` : '';
    return this.request(`/api/v1/products/${productId}/price${query}`);
  }

  // ========================
  // MARKET ENDPOINTS
  // ========================

  async getMarketListings(filters?: {
    category?: string;
    region?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<BackendResponse<MarketListing[]>> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.region) params.append('region', filters.region);
    if (filters?.minPrice) params.append('min_price', String(filters.minPrice));
    if (filters?.maxPrice) params.append('max_price', String(filters.maxPrice));

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/v1/market/listings${query}`);
  }

  async createMarketListing(data: {
    productId: number;
    quantity: number;
    pricePerUnit: number;
    description: string;
  }): Promise<BackendResponse<MarketListing>> {
    return this.request('/api/v1/market/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ========================
  // ORDER ENDPOINTS
  // ========================

  async createOrder(data: {
    productId: number;
    farmerId: string;
    quantity: number;
    totalAmount: number;
    deliveryInfo: string;
  }): Promise<BackendResponse<Order>> {
    return this.request('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOrders(role?: 'buyer' | 'farmer'): Promise<BackendResponse<Order[]>> {
    const query = role ? `?role=${role}` : '';
    return this.request(`/api/v1/orders${query}`);
  }

  async getOrderById(orderId: number): Promise<BackendResponse<Order>> {
    return this.request(`/api/v1/orders/${orderId}`);
  }

  async confirmOrder(orderId: number): Promise<BackendResponse<Order>> {
    return this.request(`/api/v1/orders/${orderId}/confirm`, {
      method: 'POST',
    });
  }

  async fulfillOrder(orderId: number): Promise<BackendResponse<Order>> {
    return this.request(`/api/v1/orders/${orderId}/fulfill`, {
      method: 'POST',
    });
  }

  async cancelOrder(orderId: number): Promise<BackendResponse<Order>> {
    return this.request(`/api/v1/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  // ========================
  // SUPPLY ENDPOINTS (FARMER)
  // ========================

  async createSupply(data: {
    productId: number;
    quantity: number;
    pricePerUnit: number;
  }): Promise<BackendResponse<Supply>> {
    return this.request('/api/v1/supply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFarmerSupply(): Promise<BackendResponse<Supply[]>> {
    return this.request('/api/v1/supply/me');
  }

  // ========================
  // CIRCULAR ECONOMY ENDPOINTS
  // ========================

  async recordWaste(data: {
    wasteType: string;
    quantity: number;
  }): Promise<BackendResponse<WasteRecord>> {
    return this.request('/api/v1/waste/record', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWasteRecords(): Promise<BackendResponse<WasteRecord[]>> {
    return this.request('/api/v1/waste/records');
  }

  async getCircularEconomyStats(): Promise<BackendResponse<{
    totalWasteProcessed: number;
    totalTokensEarned: number;
    currentBalance: number;
  }>> {
    return this.request('/api/v1/waste/stats');
  }

  // ========================
  // PROFILE ENDPOINTS
  // ========================

  async updateProfile(data: Partial<User>): Promise<BackendResponse<User>> {
    return this.request('/api/v1/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<BackendResponse<User>> {
    return this.request('/api/v1/profile');
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// For testing/overriding
export { APIClient };
