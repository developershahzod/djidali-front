// Complete Djidali API Integration
const API_BASE_URL = 'https://demo-api.djidali.uz/api';

// Enhanced Types for all API endpoints
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  phone?: string;
  avatar?: string;
  is_active: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Tour {
  id: string | number;
  title: string;
  description: string;
  short_description?: string;
  price: number;
  duration: number;
  max_participants: number;
  current_participants?: number;
  location: string;
  category_id: number;
  category?: Category;
  images?: TourImage[];
  dates?: TourDate[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  rating?: number;
  reviews_count?: number;
  image?: string;
  badge?: string;
  type?: string;
  guide?: {
    name: string;
    avatar: string;
  };
  participants?: number;
  maxParticipants?: number;
  reviewCount?: number;
  originalPrice?: number;
  discount?: string;
  subcategory?: string;
  features?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: TourItinerary[];
  currency?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_active: boolean;
  tours_count?: number;
  created_at: string;
  updated_at: string;
}

export interface TourImage {
  id: number;
  tour_id: string | number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface TourDate {
  id: number;
  tour_id: number;
  start_date: string;
  end_date: string;
  available_spots: number;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TourItinerary {
  id: number;
  tour_id: string | number;
  day: number;
  title: string;
  description: string;
  activities?: string[];
  meals?: string[];
  accommodation?: string;
}

export interface Booking {
  id: number;
  tour_id: number;
  tour: Tour;
  user_id: number;
  user: User;
  tour_date_id: number;
  tour_date: TourDate;
  participants_count: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'paid';
  payment_status: 'pending' | 'paid' | 'refunded';
  booking_date: string;
  customer_info: CustomerInfo;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerInfo {
  full_name: string;
  email: string;
  phone: string;
  telegram_username?: string;
  passport_number?: string;
  emergency_contact?: string;
  dietary_requirements?: string;
  special_requests?: string;
}

export interface Review {
  id: number;
  tour_id: number;
  tour: Tour;
  user_id: number;
  user: User;
  booking_id?: number;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  is_approved: boolean;
  is_featured: boolean;
  helpful_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  booking: Booking;
  amount: number;
  currency: string;
  payment_method: 'card' | 'cash' | 'bank_transfer' | 'payme' | 'click';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  payment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  data?: any;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

export interface Statistics {
  total_tours: number;
  total_bookings: number;
  total_users: number;
  total_revenue: number;
  monthly_bookings: Array<{ month: string; count: number; revenue: number }>;
  popular_tours: Array<{ tour: Tour; bookings_count: number; revenue: number }>;
  recent_bookings: Booking[];
  user_registrations: Array<{ date: string; count: number }>;
  revenue_by_category: Array<{ category: Category; revenue: number }>;
}

// Complete API Service Class
class ApiService {
  private baseURL = API_BASE_URL;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
          this.logout();
          throw new Error('Authentication required');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication Endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.access_token;
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    this.token = response.access_token;
    localStorage.setItem('auth_token', this.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/refresh', {
      method: 'POST',
    });

    this.token = response.access_token;
    localStorage.setItem('auth_token', this.token);
    
    return response;
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tours Endpoints
  async getTours(params?: {
    page?: number;
    per_page?: number;
    category_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    duration?: number;
    location?: string;
    sort?: string;
    is_active?: boolean;
  }): Promise<PaginatedResponse<Tour>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/tours${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<any>(endpoint);
    
    if (response.data && Array.isArray(response.data)) {
      return response;
    } else if (Array.isArray(response)) {
      return {
        data: response,
        current_page: 1,
        last_page: 1,
        per_page: response.length,
        total: response.length,
        from: 1,
        to: response.length,
        links: {
          first: '',
          last: ''
        }
      };
    }
    
    return response;
  }

  async getTour(id: number): Promise<Tour> {
    const response = await this.request<any>(`/tours/${id}`);
    return response.data || response;
  }

  async createTour(tourData: Partial<Tour>): Promise<Tour> {
    const response = await this.request<ApiResponse<Tour>>('/tours', {
      method: 'POST',
      body: JSON.stringify(tourData),
    });
    return response.data;
  }

  async updateTour(id: number, tourData: Partial<Tour>): Promise<Tour> {
    const response = await this.request<ApiResponse<Tour>>(`/tours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tourData),
    });
    return response.data;
  }

  async deleteTour(id: number): Promise<void> {
    await this.request(`/tours/${id}`, { method: 'DELETE' });
  }

  async getFeaturedTours(): Promise<Tour[]> {
    const response = await this.request<ApiResponse<Tour[]>>('/tours/featured');
    return response.data;
  }

  async getPopularTours(): Promise<Tour[]> {
    const response = await this.request<ApiResponse<Tour[]>>('/tours/popular');
    return response.data;
  }

  // Categories Endpoints
  async getCategories(): Promise<Category[]> {
    const response = await this.request<ApiResponse<Category[]>>('/categories');
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.request<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const response = await this.request<ApiResponse<Category>>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return response.data;
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<Category> {
    const response = await this.request<ApiResponse<Category>>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return response.data;
  }

  async deleteCategory(id: number): Promise<void> {
    await this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  // Bookings Endpoints
  async getBookings(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    tour_id?: number;
    user_id?: number;
    date_from?: string;
    date_to?: string;
  }): Promise<PaginatedResponse<Booking>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Booking>>(endpoint);
  }

  async getBooking(id: number): Promise<Booking> {
    const response = await this.request<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  }

  async createBooking(bookingData: {
    tour_id: number;
    tour_date_id: number;
    participants_count: number;
    customer_info: CustomerInfo;
    special_requests?: string;
  }): Promise<Booking> {
    const response = await this.request<ApiResponse<Booking>>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return response.data;
  }

  async updateBooking(id: number, bookingData: Partial<Booking>): Promise<Booking> {
    const response = await this.request<ApiResponse<Booking>>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
    return response.data;
  }

  async cancelBooking(id: number, reason?: string): Promise<Booking> {
    const response = await this.request<ApiResponse<Booking>>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return response.data;
  }

  async confirmBooking(id: number): Promise<Booking> {
    const response = await this.request<ApiResponse<Booking>>(`/bookings/${id}/confirm`, {
      method: 'POST',
    });
    return response.data;
  }

  async getMyBookings(): Promise<Booking[]> {
    const response = await this.request<ApiResponse<Booking[]>>('/bookings/my');
    return response.data;
  }

  // Reviews Endpoints
  async getReviews(params?: {
    tour_id?: number;
    user_id?: number;
    rating?: number;
    is_approved?: boolean;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Review>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Review>>(endpoint);
  }

  async getReview(id: number): Promise<Review> {
    const response = await this.request<ApiResponse<Review>>(`/reviews/${id}`);
    return response.data;
  }

  async createReview(reviewData: {
    tour_id: number;
    booking_id?: number;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }): Promise<Review> {
    const response = await this.request<ApiResponse<Review>>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    return response.data;
  }

  async updateReview(id: number, reviewData: Partial<Review>): Promise<Review> {
    const response = await this.request<ApiResponse<Review>>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
    return response.data;
  }

  async deleteReview(id: number): Promise<void> {
    await this.request(`/reviews/${id}`, { method: 'DELETE' });
  }

  async approveReview(id: number): Promise<Review> {
    const response = await this.request<ApiResponse<Review>>(`/reviews/${id}/approve`, {
      method: 'POST',
    });
    return response.data;
  }

  async markReviewHelpful(id: number): Promise<Review> {
    const response = await this.request<ApiResponse<Review>>(`/reviews/${id}/helpful`, {
      method: 'POST',
    });
    return response.data;
  }

  // Payments Endpoints
  async getPayments(params?: {
    booking_id?: number;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Payment>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/payments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Payment>>(endpoint);
  }

  async createPayment(paymentData: {
    booking_id: number;
    amount: number;
    payment_method: string;
  }): Promise<Payment> {
    const response = await this.request<ApiResponse<Payment>>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.data;
  }

  async processPayment(id: number, paymentData: {
    transaction_id?: string;
    payment_details?: any;
  }): Promise<Payment> {
    const response = await this.request<ApiResponse<Payment>>(`/payments/${id}/process`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.data;
  }

  // Notifications Endpoints
  async getNotifications(params?: {
    is_read?: boolean;
    type?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Notification>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<Notification>>(endpoint);
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const response = await this.request<ApiResponse<Notification>>(`/notifications/${id}/read`, {
      method: 'POST',
    });
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    return this.request('/notifications/mark-all-read', {
      method: 'POST',
    });
  }

  // Admin Endpoints
  async getStatistics(): Promise<Statistics> {
    const response = await this.request<ApiResponse<Statistics>>('/admin/statistics');
    return response.data;
  }

  async getUsers(params?: {
    page?: number;
    per_page?: number;
    role?: string;
    search?: string;
    is_active?: boolean;
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<PaginatedResponse<User>>(endpoint);
  }

  async getUser(id: number): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/admin/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.request(`/admin/users/${id}`, { method: 'DELETE' });
  }

  async activateUser(id: number): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/admin/users/${id}/activate`, {
      method: 'POST',
    });
    return response.data;
  }

  async deactivateUser(id: number): Promise<User> {
    const response = await this.request<ApiResponse<User>>(`/admin/users/${id}/deactivate`, {
      method: 'POST',
    });
    return response.data;
  }

  // File Upload
  async uploadFile(file: File, type: 'tour_image' | 'avatar' | 'review_image' = 'tour_image'): Promise<{ url: string; path: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const result = await response.json();
    return result.data || result;
  }

  async uploadMultipleFiles(files: File[], type: 'tour_image' | 'avatar' | 'review_image' = 'tour_image'): Promise<{ url: string; path: string }[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/multiple`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const result = await response.json();
    return result.data || result;
  }

  // Search Endpoints
  async searchTours(query: string, filters?: {
    category_id?: number;
    min_price?: number;
    max_price?: number;
    duration?: number;
    location?: string;
  }): Promise<Tour[]> {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await this.request<ApiResponse<Tour[]>>(`/search/tours?${params.toString()}`);
    return response.data;
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await this.request<ApiResponse<string[]>>(`/search/suggestions?q=${query}`);
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;