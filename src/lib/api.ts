// API configuration and types for Honey API
// const API_BASE_URL = 'http://localhost:3000';

// const API_BASE_URL = "https://honey-api-1.onrender.com";
const API_BASE_URL = "honey-oogiz4ddt-safidys-projects-7629980e.vercel.app";

// Types based on OpenAPI schema
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CreateAuthDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginAuthDto {
  email: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  badge?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  badge?: string;
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  userId: string;
  items: CreateOrderItemDto[];
}

// API helper class
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("auth_token");
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.getHeaders(), ...options.headers },
    });

    if (!response.ok) {
      const text = await response.text();
      if (import.meta.env.DEV) {
        console.error("❌ Erreur API:", response.status, text);
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async register(data: CreateAuthDto): Promise<User> {
    return this.request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(
    data: LoginAuthDto,
  ): Promise<{ access_token: string; user: User }> {
    const result = await this.request<{ access_token: string; user: User }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );

    this.token = result.access_token;
    localStorage.setItem("auth_token", result.access_token);
    localStorage.setItem("auth_user", JSON.stringify(result.user));

    if (import.meta.env.DEV) {
      console.log("✅ Utilisateur connecté:", result.user);
    }

    return result;
  }

  getUserFromStorage(): User | null {
    const userStr = localStorage.getItem("auth_user");
    return userStr ? JSON.parse(userStr) : null;
  }

  async getProfile(): Promise<User> {
    const profile = await this.request<User>("/auth/profile");
    if (import.meta.env.DEV) {
      console.log("✅ Profil récupéré:", profile);
    }
    return profile;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    if (import.meta.env.DEV) {
      console.log("🔒 Utilisateur déconnecté");
    }
  }

  // Products methods
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products");
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: CreateProductDto): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request(`/products/${id}`, { method: "DELETE" });
  }

  // Orders methods
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>("/orders");
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async patchOrder(id: string, data: Partial<Order>): Promise<Order> {
    if (import.meta.env.DEV) {
      console.log("📤 PATCH Order data:", data);
    }
    return this.request<Order>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteOrder(id: string): Promise<void> {
    await this.request(`/orders/${id}`, { method: "DELETE" });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
