import axios from 'axios';
import { 
  User, 
  FoodItem, 
  CartItem, 
  Order, 
  Address, 
  ApiResponse,
  LoginResponse,
  FoodItemRequest,
  UpdateFoodItemRequest,
  FoodItemFilter,
  PaymentRequest,
  PaymentVerification,
  OrderStats,
  VegNonVegStats,
  ItemOrderStats
} from '../types';

const API_BASE_URL = 'http://localhost:8080';
const PAYMENT_BASE_URL = 'http://localhost:8081';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { username: string; email: string; password: string }, portal: string) => {
    const response = await api.post<ApiResponse<string>>('/api/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password
    }, {
      headers: { Requestedportal: portal } // Backend expects this exact header name
    });
    return response.data;
  },

  login: async (data: { email: string; password: string }, portal: string) => {
    const response = await api.post<ApiResponse<{ username: string; jwtToken: string }>>('/api/auth/login', {
      email: data.email,
      password: data.password
    }, {
      headers: { Requestedportal: portal } // Backend expects this exact header name
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse<string>>('/api/auth/logout');
    return response.data;
  },

  forgotPassword: async (email: string, portal: string) => {
    const response = await api.post<ApiResponse<string>>(`/api/auth/forgot-password?email=${email}`, {}, {
      headers: { Requestedportal: portal } // Backend expects this exact header name
    });
    return response.data;
  },

  updatePassword: async (email: string, password: string, otp: string, portal: string) => {
    const response = await api.post<ApiResponse<string>>(
      `/api/auth/update-password?email=${email}&password=${password}&otp=${otp}`,
      {},
      { headers: { Requestedportal: portal } } // Backend expects this exact header name
    );
    return response.data;
  },
};

// Food Items API
export const foodAPI = {
  getAllFoods: async () => {
    const response = await api.get<ApiResponse<string>>('/api/foods');
    return response.data;
  },

  addFood: async (data: FoodItemRequest) => {
    const response = await api.post<ApiResponse<string>>('/api/admin/foods', {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.image || '',
      imageUrl: data.imageUrl || '',
      isDeleted: false
    });
    return response.data;
  },

  updateFood: async (id: number, data: UpdateFoodItemRequest) => {
    const response = await api.put<ApiResponse<string>>(`/api/admin/foods/${id}`, {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
      available: data.available
    });
    return response.data;
  },

  deleteFood: async (id: number) => {
    const response = await api.delete<ApiResponse<string>>(`/api/admin/foods/${id}`);
    return response.data;
  },

  getFoodsByFilter: async (filter: FoodItemFilter) => {
    const response = await api.get<ApiResponse<FoodItem[]>>('/api/admin/foods', { 
      data: filter 
    });
    return response.data;
  },

  updateFoodName: async (id: number, name: string) => {
    const response = await api.patch<ApiResponse<string>>(`/api/admin/foods/${id}/name?name=${name}`);
    return response.data;
  },

  updateFoodPrice: async (id: number, price: number) => {
    const response = await api.patch<ApiResponse<string>>(`/api/admin/foods/${id}/price?price=${price}`);
    return response.data;
  },

  updateFoodCategory: async (id: number, category: string) => {
    const response = await api.patch<ApiResponse<string>>(`/api/admin/foods/${id}/category?category=${category}`);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  getCartItems: async (userId: number) => {
    const response = await api.get<ApiResponse<any[]>>(`/api/cart/${userId}`);
    return response.data;
  },

  addToCart: async (userId: number, foodItemId: number, quantity: number) => {
    const response = await api.post<ApiResponse<string>>(
      `/api/cart/add?userId=${userId}&foodItemId=${foodItemId}&quantity=${quantity}`
    );
    return response.data;
  },

  removeFromCart: async (userId: number, cartItemId: number) => {
    const response = await api.delete<ApiResponse<string>>(`/api/cart/${userId}/item/${cartItemId}`);
    return response.data;
  },

  updateCartItemQuantity: async (userId: number, cartItemId: number, quantity: number) => {
    const response = await api.put<ApiResponse<string>>(
      `/api/cart/${userId}/item/${cartItemId}?quantity=${quantity}`
    );
    return response.data;
  },

  clearCart: async (userId: number) => {
    const response = await api.delete<ApiResponse<string>>(`/api/cart/${userId}/clear`);
    return response.data;
  },

  getCartTotal: async (userId: number) => {
    const response = await api.get<ApiResponse<number>>(`/api/cart/${userId}/total`);
    return response.data;
  },
};

// Orders API
export const orderAPI = {
  checkoutCart: async (userId: number, addressId: number) => {
    const response = await api.post<ApiResponse<string>>(
      `/api/orders/checkout?userId=${userId}&addressId=${addressId}`
    );
    return response.data;
  },

  getOrderStats: async (date?: string) => {
    const url = date ? `/api/admin/orders/stats?date=${date}` : '/api/admin/orders/stats';
    const response = await api.get<ApiResponse<OrderStats>>(url);
    return response.data;
  },

  getVegNonVegStats: async (date?: string) => {
    const url = date ? `/api/admin/orders/veg-nonveg-stats?date=${date}` : '/api/admin/orders/veg-nonveg-stats';
    const response = await api.get<ApiResponse<VegNonVegStats>>(url);
    return response.data;
  },

  getItemOrderStats: async (date?: string) => {
    const url = date ? `/api/admin/orders/item-stats?date=${date}` : '/api/admin/orders/item-stats';
    const response = await api.get<ApiResponse<ItemOrderStats>>(url);
    return response.data;
  },
};

// Address API
export const addressAPI = {
  addAddress: async (userId: number, address: Omit<Address, 'id' | 'user' | 'isDeleted'>) => {
    const response = await api.post<ApiResponse<Address>>(`/api/address/add?userId=${userId}`, {
      addressLine1: address.street,
      addressLine2: '',
      city: address.city,
      state: address.state,
      postalCode: address.zipCode,
      country: 'India',
      phoneNumber: '',
      isDefault: address.isDefault
    });
    return response.data;
  },

  getAddresses: async (userId: number) => {
    const response = await api.get<ApiResponse<Address[]>>(`/api/address/list?userId=${userId}`);
    return response.data;
  },

  deleteAddress: async (userId: number, addressId: number) => {
    const response = await api.delete<ApiResponse<string>>(`/api/address/delete?userId=${userId}&addressId=${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (userId: number, addressId: number) => {
    const response = await api.put<ApiResponse<Address>>(`/api/address/set-default?userId=${userId}&addressId=${addressId}`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  createOrder: async (data: PaymentRequest) => {
    const response = await axios.post(`${PAYMENT_BASE_URL}/create-order`, {
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      receipt: data.receipt
    });
    return response.data;
  },

  verifyPayment: async (data: PaymentVerification) => {
    const response = await axios.post(`${PAYMENT_BASE_URL}/verify-payment`, {
      paymentId: data.paymentId,
      orderId: data.orderId,
      signature: data.signature
    });
    return response.data;
  },
};

// Admin User Management API
export const adminUserAPI = {
  getAllUsers: async () => {
    const response = await api.get<ApiResponse<User[]>>('/api/admin/users');
    return response.data;
  },

  updateUserRole: async (userId: number, role: string) => {
    const response = await api.put<ApiResponse<string>>(`/api/admin/users/${userId}/role?role=${role}`);
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete<ApiResponse<string>>(`/api/admin/users/${userId}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get<ApiResponse<{ totalUsers: number; adminUsers: number; regularUsers: number; adminPercentage: number; userPercentage: number }>>('/api/admin/users/stats');
    return response.data;
  },
};

// Admin Order Management API
export const adminOrderAPI = {
  getAllOrders: async () => {
    const response = await api.get<ApiResponse<Order[]>>('/api/admin/orders');
    return response.data;
  },

  getOrderById: async (orderId: number) => {
    const response = await api.get<ApiResponse<Order>>(`/api/admin/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await api.put<ApiResponse<string>>(`/api/admin/orders/${orderId}/status?status=${status}`);
    return response.data;
  },
};

export default api; 