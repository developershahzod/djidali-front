const API_BASE_URL = 'https://demo-api.djidali.uz/api';

export interface ApiTour {
  id: string;
  uuid?: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: Record<string, any>;
  currency: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  images: string[];
  itinerary: Record<string, string>;
  inclusions: string[];
  exclusions: string[];
  status: 'ACTIVE' | 'INACTIVE';
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  orders?: Array<{
    id: string;
    status: string;
    participants: number;
  }>;
  _count?: {
    orders: number;
  };
}

export interface ApiToursResponse {
  data: ApiTour[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'SALES_MANAGER' | 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
}

export interface ApiAuthResponse {
  accessToken: string;
  user: ApiUser;
}

export interface ApiOrder {
  id: string;
  orderNumber?: string;
  tourId: string;
  clientId?: string | null;
  customerId?: string;
  managerId?: string | null;
  userId?: string;
  participants: number;
  totalAmount: number;
  paidAmount?: number;
  status: 'PENDING' | 'CONFIRMED' | 'FULLY_PAID' | 'CANCELLED';
  notes?: string;
  lastActivityAt?: string;
  expiresAt?: string;
  expiredAt?: string | null;
  autoExpired?: boolean;
  createdAt: string;
  updatedAt: string;
  tour?: ApiTour;
  user?: ApiUser;
  payments?: any[];
  statusHistory?: any[];
}

export interface ApiOrdersResponse {
  data: ApiOrder[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiWishlistItem {
  id: string;
  userId: string;
  tourId: string;
  createdAt: string;
  tour?: ApiTour;
}

export interface ApiWishlistResponse {
  data: ApiWishlistItem[];
  total: number;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string | null;
  isActive: boolean;
  order: number;
  depth: number;
  createdAt: string;
  updatedAt: string;
  children?: ApiCategory[];
  parent?: ApiCategory;
}

export interface ApiCategoriesResponse {
  data?: ApiCategory[];
  categories?: ApiCategory[];
}

class DjidaliApiService {
  private baseURL = API_BASE_URL;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('djidali_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuth();
          throw new Error('Authentication required');
        }

        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message ||
          (Array.isArray(errorData.errors) ? errorData.errors.map((e: any) =>
            Object.values(e.constraints || {}).join(', ')
          ).join('; ') : `HTTP error! status: ${response.status}`);

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'CUSTOMER';
    passportNumber: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
  }): Promise<ApiAuthResponse> {
    const response = await this.request<ApiAuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.token = response.accessToken;
    localStorage.setItem('djidali_token', this.token);
    localStorage.setItem('djidali_user', JSON.stringify(response.user));

    return response;
  }

  async login(email: string, password: string): Promise<ApiAuthResponse> {
    const response = await this.request<ApiAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.accessToken;
    localStorage.setItem('djidali_token', this.token);
    localStorage.setItem('djidali_user', JSON.stringify(response.user));

    return response;
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  private clearAuth(): void {
    this.token = null;
    localStorage.removeItem('djidali_token');
    localStorage.removeItem('djidali_user');
  }

  async getTours(params?: {
    page?: number;
    limit?: number;
    per_page?: number;
    search?: string;
    destination?: string;
    minPrice?: number;
    maxPrice?: number;
    min_price?: number;
    max_price?: number;
    duration?: number;
    status?: string;
    categoryId?: string;
    category_id?: number;
  }): Promise<ApiToursResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/tours${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<ApiToursResponse>(endpoint);
  }

  async getTour(id: string): Promise<ApiTour> {
    return this.request<ApiTour>(`/tours/${id}`);
  }

  async createTour(tourData: {
    title: string;
    description: string;
    destination: string;
    duration: number;
    price: number;
    currency: string;
    maxParticipants: number;
    startDate: string;
    endDate: string;
    images: string[];
    itinerary: Record<string, string>;
    inclusions: string[];
    exclusions: string[];
    status: 'ACTIVE' | 'INACTIVE';
    categoryId: string;
  }): Promise<ApiTour> {
    return this.request<ApiTour>('/tours', {
      method: 'POST',
      body: JSON.stringify(tourData),
    });
  }

  async updateTour(id: string, tourData: Partial<ApiTour>): Promise<ApiTour> {
    return this.request<ApiTour>(`/tours/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(tourData),
    });
  }

  async deleteTour(id: string): Promise<void> {
    await this.request(`/tours/${id}`, { method: 'DELETE' });
  }

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    tourId?: string;
  }): Promise<ApiOrdersResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/customer/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<ApiOrdersResponse>(endpoint);
  }

  async getAdminOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    tourId?: string;
  }): Promise<ApiOrdersResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<ApiOrdersResponse>(endpoint);
  }

  async getOrder(id: string): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    tourId: string;
    participants: number;
    notes?: string;
  }): Promise<ApiOrder> {
    return this.request<ApiOrder>('/customer/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id: string, orderData: Partial<ApiOrder>): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: string): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  }

  async getWishlist(): Promise<ApiWishlistResponse> {
    return this.request<ApiWishlistResponse>('/wishlist');
  }

  async addToWishlist(tourId: string): Promise<ApiWishlistItem> {
    return this.request<ApiWishlistItem>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ tourId }),
    });
  }

  async removeFromWishlist(tourId: string): Promise<void> {
    await this.request(`/wishlist/${tourId}`, { method: 'DELETE' });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): ApiUser | null {
    const userStr = localStorage.getItem('djidali_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('djidali_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  async getCategories(): Promise<ApiCategory[]> {
    const response = await this.request<ApiCategory[]>('/tour-categories');
    return response;
  }

  async getCategoryTree(): Promise<ApiCategory[]> {
    const response = await this.request<ApiCategory[]>('/tour-categories/tree');
    return response;
  }

  async getCategory(id: string): Promise<ApiCategory> {
    return this.request<ApiCategory>(`/tour-categories/${id}`);
  }

  async getCategoryBySlug(slug: string): Promise<ApiCategory> {
    return this.request<ApiCategory>(`/tour-categories/slug/${slug}`);
  }

  async searchCategories(query: string): Promise<ApiCategory[]> {
    const response = await this.request<ApiCategory[]>(`/tour-categories/search?q=${encodeURIComponent(query)}`);
    return response;
  }

  async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    parentId?: string | null;
    sortOrder?: number;
  }): Promise<ApiCategory> {
    return this.request<ApiCategory>('/tour-categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: Partial<ApiCategory>): Promise<ApiCategory> {
    return this.request<ApiCategory>(`/tour-categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/tour-categories/${id}`, { method: 'DELETE' });
  }

  async toggleCategoryStatus(id: string): Promise<ApiCategory> {
    return this.request<ApiCategory>(`/tour-categories/${id}/toggle-active`, {
      method: 'PATCH',
    });
  }
}

export const djidaliApi = new DjidaliApiService();
export default djidaliApi;
