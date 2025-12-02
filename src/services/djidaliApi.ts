import { ApiTourResponse } from "../types/tour.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://demo-api.djidali.uz/api";

export type ApiTour = ApiTourResponse;

export interface ApiTourLegacy {
  id: string;
  uuid?: string;
  title: string;
  titleUz?: string;
  titleRu?: string;
  titleEng?: string;
  titleDe?: string;
  description: string;
  descriptionUz?: string;
  descriptionRu?: string;
  descriptionEng?: string;
  descriptionDe?: string;
  destination: string;
  duration: number;
  price: number | { amount: number; currency: string };
  currency: string;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  images: string[];
  itinerary?: Record<string, string>;
  inclusions: any[];
  exclusions: any[];
  status: "ACTIVE" | "INACTIVE";
  isHidden: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    nameUz?: string;
    nameRu?: string;
    nameEng?: string;
    nameDe?: string;
    slug: string;
    description?: string;
    descriptionUz?: string;
    descriptionRu?: string;
    descriptionEng?: string;
    descriptionDe?: string;
    icon?: string;
    parentId?: string | null;
    path?: string;
    depth?: number;
    sortOrder?: number;
    isActive: boolean;
    createdAt: string | Record<string, any>;
    updatedAt: string | Record<string, any>;
  };
  tags?: string[];
  type?: string;
  createdAt: string | Record<string, any>;
  updatedAt: string | Record<string, any>;
  orders?: Array<{
    id: string;
    status: string;
    participants: number;
  }>;
  _count?: {
    orders: number;
  };
  program?: any[];
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
  role: "ADMIN" | "SALES_MANAGER" | "CUSTOMER";
  createdAt: string;
  updatedAt: string;
}

export interface ApiAuthResponse {
  accessToken: string;
  refreshToken: string;
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
  status: "PENDING" | "CONFIRMED" | "FULLY_PAID" | "CANCELLED";
  notes?: string;
  imageUrls?: string[];
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
  createdAt: string | Record<string, any>;
  updatedAt: string | Record<string, any>;
  children?: ApiCategory[];
  parent?: ApiCategory;
}

export interface ApiCategoriesResponse {
  data?: ApiCategory[];
  categories?: ApiCategory[];
}

// News types - Backend uses different field names, we transform them
export interface ApiNewsBackend {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string | null;
  titleEng: string | null;
  titleDe: string | null;
  contentUz: string;
  contentRu: string | null;
  contentEng: string | null;
  contentDe: string | null;
  excerptUz: string | null;
  excerptRu: string | null;
  excerptEng: string | null;
  excerptDe: string | null;
  coverImage: string | null;
  images: string[] | null;
  tags: string[] | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isActive: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  authorId: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  // Localized fields added by backend when lang param is used
  title?: string;
  content?: string;
  excerpt?: string;
}

// Frontend news article format (what admin page expects)
export interface ApiNewsArticle {
  id: string;
  titleRu: string;
  titleUz: string;
  titleEn: string;
  titleDe: string;
  summaryRu: string;
  summaryUz: string;
  summaryEn: string;
  summaryDe: string;
  contentRu: string;
  contentUz: string;
  contentEn: string;
  contentDe: string;
  slug: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface ApiNewsResponse {
  data: ApiNewsArticle[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface ApiNewsCreateData {
  titleRu: string;
  titleUz: string;
  titleEn: string;
  titleDe: string;
  summaryRu: string;
  summaryUz: string;
  summaryEn: string;
  summaryDe: string;
  contentRu: string;
  contentUz: string;
  contentEn: string;
  contentDe: string;
  slug: string;
  imageUrl: string;
  isPublished: boolean;
}

class DjidaliApiService {
  private baseURL = API_BASE_URL;
  private token: string | null = null;
  private refreshing: boolean = false;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    // Initialize with token from localStorage
    this.token =
      localStorage.getItem("auth_token") ||
      localStorage.getItem("djidali_token");
  }

  private getFreshToken(): string | null {
    // Always get fresh token from localStorage
    return (
      localStorage.getItem("auth_token") ||
      localStorage.getItem("djidali_token") ||
      this.token
    );
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Get fresh token for each request
    const currentToken = this.getFreshToken();
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
          // Try to refresh token
          try {
            await this.refreshAccessToken();

            // Retry original request with new token
            const retryHeaders: Record<string, string> = {
              "Content-Type": "application/json",
              ...(options.headers as Record<string, string>),
            };

            const newToken = this.getFreshToken();
            if (newToken) {
              retryHeaders["Authorization"] = `Bearer ${newToken}`;
            }

            const retryResponse = await fetch(url, {
              ...options,
              headers: retryHeaders,
            });

            if (!retryResponse.ok) {
              throw new Error("Request failed after token refresh");
            }

            return await retryResponse.json();
          } catch (refreshError) {
            // Refresh failed, clear auth and throw
            this.clearAuth();
            throw new Error("Authentication required");
          }
        }

        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message ||
          (Array.isArray(errorData.errors)
            ? errorData.errors
                .map((e: any) => Object.values(e.constraints || {}).join(", "))
                .join("; ")
            : `HTTP error! status: ${response.status}`);

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
    role: "CUSTOMER";
    passportNumber: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
  }): Promise<ApiAuthResponse> {
    const response = await this.request<ApiAuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });

    this.token = response.accessToken;
    localStorage.setItem("auth_token", this.token);
    localStorage.setItem("refresh_token", response.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  async login(email: string, password: string): Promise<ApiAuthResponse> {
    const response = await this.request<ApiAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.token = response.accessToken;
    localStorage.setItem("auth_token", this.token);
    localStorage.setItem("refresh_token", response.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  private clearAuth(): void {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("djidali_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("djidali_user");
  }

  private async refreshAccessToken(): Promise<void> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const data: ApiAuthResponse = await response.json();

        // Update tokens
        this.token = data.accessToken;
        localStorage.setItem("auth_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        // Refresh failed, clear auth and throw
        this.clearAuth();
        throw error;
      } finally {
        this.refreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
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
    lang?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiToursResponse> {
    const queryParams = new URLSearchParams();

    if (params?.lang === "en") {
      params.lang = "eng";
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/tours${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.request<ApiToursResponse>(endpoint);
  }

  async getTour(id: string, params?: { lang?: string }): Promise<ApiTour> {
    const queryParams = new URLSearchParams();
    if (params?.lang) {
      const lang = params.lang === "en" ? "eng" : params.lang;
      queryParams.append("lang", lang);
    }
    return this.request<ApiTour>(
      `/tours/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    );
  }

  async createTour(tourData: {
    title: string;
    titleUz?: string;
    titleRu?: string;
    titleEng?: string;
    titleDe?: string;
    description: string;
    descriptionUz?: string;
    descriptionRu?: string;
    descriptionEng?: string;
    descriptionDe?: string;
    destination: string;
    duration: number;
    price: number;
    currency: string;
    maxParticipants: number;
    startDate: string;
    endDate: string;
    images: string[];
    inclusions: any[];
    exclusions: any[];
    status: "ACTIVE" | "INACTIVE";
    categoryId: string;
    program: any[];
  }): Promise<ApiTour> {
    return this.request<ApiTour>("/tours", {
      method: "POST",
      body: JSON.stringify(tourData),
    });
  }

  async updateTour(id: string, tourData: Partial<ApiTour>): Promise<ApiTour> {
    return this.request<ApiTour>(`/tours/${id}`, {
      method: "PUT",
      body: JSON.stringify(tourData),
    });
  }

  async deleteTour(id: string): Promise<void> {
    await this.request(`/tours/${id}`, { method: "DELETE" });
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

    const endpoint = `/customer/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
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

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.request<ApiOrdersResponse>(endpoint);
  }

  async getOrder(id: string): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    tourId: string;
    participants: number;
    notes?: string;
    imageUrls?: string[];
  }): Promise<ApiOrder> {
    return this.request<ApiOrder>("/customer/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(
    id: string,
    orderData: Partial<ApiOrder>,
  ): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: string): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}/cancel`, {
      method: "POST",
    });
  }

  async getWishlist(): Promise<ApiWishlistResponse> {
    return this.request<ApiWishlistResponse>("/wishlist");
  }

  async addToWishlist(tourId: string): Promise<ApiWishlistItem> {
    return this.request<ApiWishlistItem>("/wishlist", {
      method: "POST",
      body: JSON.stringify({ tourId }),
    });
  }

  async removeFromWishlist(tourId: string): Promise<void> {
    await this.request(`/wishlist/${tourId}`, { method: "DELETE" });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): ApiUser | null {
    const userStr =
      localStorage.getItem("user") || localStorage.getItem("djidali_user");
    return userStr ? JSON.parse(userStr) : null;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  getToken(): string | null {
    return this.getFreshToken();
  }

  async getCategories(params?: { lang?: string }): Promise<ApiCategory[]> {
    const queryParams = new URLSearchParams();
    if (params?.lang) {
      const lang = params.lang === "en" ? "eng" : params.lang;
      queryParams.append("lang", lang);
    }
    const endpoint = `/tour-categories${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return this.request<ApiCategory[]>(endpoint);
  }

  async getCategoryTree(params?: { lang?: string }): Promise<ApiCategory[]> {
    const query = params?.lang
      ? `?lang=${encodeURIComponent(params.lang)}`
      : "";
    const response = await this.request<ApiCategory[]>(
      `/tour-categories/tree${query}`,
    );
    return response;
  }

  async getCategory(
    id: string,
    params?: { lang?: string },
  ): Promise<ApiCategory> {
    const query = params?.lang
      ? `?lang=${encodeURIComponent(params.lang)}`
      : "";
    return this.request<ApiCategory>(`/tour-categories/${id}${query}`);
  }

  async getCategoryBySlug(
    slug: string,
    params?: { lang?: string },
  ): Promise<ApiCategory> {
    const query = params?.lang
      ? `?lang=${encodeURIComponent(params.lang)}`
      : "";
    return this.request<ApiCategory>(`/tour-categories/slug/${slug}${query}`);
  }

  async searchCategories(query: string): Promise<ApiCategory[]> {
    const response = await this.request<ApiCategory[]>(
      `/tour-categories/search?q=${encodeURIComponent(query)}`,
    );
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
    return this.request<ApiCategory>("/tour-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(
    id: string,
    categoryData: Partial<ApiCategory>,
  ): Promise<ApiCategory> {
    return this.request<ApiCategory>(`/tour-categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/tour-categories/${id}`, { method: "DELETE" });
  }

  async toggleCategoryStatus(id: string): Promise<ApiCategory> {
    return this.request<ApiCategory>(`/tour-categories/${id}/toggle-active`, {
      method: "PATCH",
    });
  }

  // ============ News Methods ============

  // Transform backend news format to frontend format
  private transformNewsToFrontend(backendNews: ApiNewsBackend): ApiNewsArticle {
    return {
      id: backendNews.id,
      titleRu: backendNews.titleRu || "",
      titleUz: backendNews.titleUz || "",
      titleEn: backendNews.titleEng || "", // Backend uses 'titleEng', frontend uses 'titleEn'
      titleDe: backendNews.titleDe || "",
      summaryRu: backendNews.excerptRu || "", // Backend uses 'excerpt', frontend uses 'summary'
      summaryUz: backendNews.excerptUz || "",
      summaryEn: backendNews.excerptEng || "",
      summaryDe: backendNews.excerptDe || "",
      contentRu: backendNews.contentRu || "",
      contentUz: backendNews.contentUz || "",
      contentEn: backendNews.contentEng || "",
      contentDe: backendNews.contentDe || "",
      slug: backendNews.slug,
      imageUrl: backendNews.coverImage || "", // Backend uses 'coverImage', frontend uses 'imageUrl'
      isPublished: backendNews.status === "PUBLISHED",
      publishedAt: backendNews.publishedAt,
      createdAt: backendNews.createdAt,
      updatedAt: backendNews.updatedAt,
      tags: backendNews.tags || [],
      isFeatured: backendNews.isFeatured,
    };
  }

  // Transform frontend news format to backend format for create/update
  private transformNewsToBackend(
    frontendData: Partial<ApiNewsCreateData>,
  ): Record<string, any> {
    const backendData: Record<string, any> = {};

    if (frontendData.titleRu !== undefined)
      backendData.titleRu = frontendData.titleRu;
    if (frontendData.titleUz !== undefined)
      backendData.titleUz = frontendData.titleUz;
    if (frontendData.titleEn !== undefined)
      backendData.titleEng = frontendData.titleEn; // En -> Eng
    if (frontendData.titleDe !== undefined)
      backendData.titleDe = frontendData.titleDe;

    if (frontendData.summaryRu !== undefined)
      backendData.excerptRu = frontendData.summaryRu; // summary -> excerpt
    if (frontendData.summaryUz !== undefined)
      backendData.excerptUz = frontendData.summaryUz;
    if (frontendData.summaryEn !== undefined)
      backendData.excerptEng = frontendData.summaryEn;
    if (frontendData.summaryDe !== undefined)
      backendData.excerptDe = frontendData.summaryDe;

    if (frontendData.contentRu !== undefined)
      backendData.contentRu = frontendData.contentRu;
    if (frontendData.contentUz !== undefined)
      backendData.contentUz = frontendData.contentUz;
    if (frontendData.contentEn !== undefined)
      backendData.contentEng = frontendData.contentEn;
    if (frontendData.contentDe !== undefined)
      backendData.contentDe = frontendData.contentDe;

    if (frontendData.slug !== undefined) backendData.slug = frontendData.slug;
    if (frontendData.imageUrl !== undefined)
      backendData.coverImage = frontendData.imageUrl; // imageUrl -> coverImage

    if (frontendData.isPublished !== undefined) {
      backendData.status = frontendData.isPublished ? "PUBLISHED" : "DRAFT";
    }

    return backendData;
  }

  async getNews(params?: {
    page?: number;
    limit?: number;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  }): Promise<ApiNewsResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);
    }

    const endpoint = `/news/admin${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await this.request<{
      data: ApiNewsBackend[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(endpoint);

    // Transform backend format to frontend format
    return {
      data: response.data.map((item) => this.transformNewsToFrontend(item)),
      meta: response.meta,
      total: response.meta?.total,
      page: response.meta?.page,
      totalPages: response.meta?.totalPages,
    };
  }

  async getNewsById(id: string): Promise<ApiNewsArticle> {
    const response = await this.request<ApiNewsBackend>(`/news/admin/${id}`);
    return this.transformNewsToFrontend(response);
  }

  async createNews(data: Partial<ApiNewsCreateData>): Promise<ApiNewsArticle> {
    const backendData = this.transformNewsToBackend(data);
    const response = await this.request<ApiNewsBackend>("/news", {
      method: "POST",
      body: JSON.stringify(backendData),
    });
    return this.transformNewsToFrontend(response);
  }

  async updateNews(
    id: string,
    data: Partial<ApiNewsCreateData>,
  ): Promise<ApiNewsArticle> {
    const backendData = this.transformNewsToBackend(data);
    const response = await this.request<ApiNewsBackend>(`/news/${id}`, {
      method: "PATCH",
      body: JSON.stringify(backendData),
    });
    return this.transformNewsToFrontend(response);
  }

  async deleteNews(id: string): Promise<void> {
    await this.request(`/news/${id}`, { method: "DELETE" });
  }

  async toggleNewsStatus(
    id: string,
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
  ): Promise<ApiNewsArticle> {
    const response = await this.request<ApiNewsBackend>(`/news/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return this.transformNewsToFrontend(response);
  }

  async toggleNewsFeatured(id: string): Promise<ApiNewsArticle> {
    const response = await this.request<ApiNewsBackend>(
      `/news/${id}/toggle-featured`,
      {
        method: "PATCH",
      },
    );
    return this.transformNewsToFrontend(response);
  }

  // ============ Image Upload ============

  async uploadImages(
    files: File[],
  ): Promise<{ urls: string[]; filenames: string[] }> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      // Use fetch directly instead of the request method to handle the response manually
      const response = await fetch(`${this.baseURL}/tours/upload-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload images");
      }

      const responseData = await response.json();

      // Handle different response formats
      if (Array.isArray(responseData)) {
        // If the response is an array of file information
        return {
          urls: responseData
            .map((file: any) => file.url || file.path || "")
            .filter(Boolean),
          filenames: responseData
            .map((file: any) => file.filename || file.name || "")
            .filter(Boolean),
        };
      }

      // Default response format
      return {
        urls: responseData.urls || [],
        filenames: responseData.filenames || [],
      };
    } catch (error: any) {
      console.error("Error in uploadImages:", error);
      throw new Error(error.message || "Failed to upload images");
    }
  }
}

export const djidaliApi = new DjidaliApiService();
export default djidaliApi;
