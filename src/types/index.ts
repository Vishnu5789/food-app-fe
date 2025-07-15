// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Food Item Types
export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt: string;
  isDeleted: boolean;
}

export interface FoodItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  isDeleted?: boolean;
}

export interface UpdateFoodItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  imageUrl?: string;
  available?: boolean;
}

export interface FoodItemFilter {
  start?: string;
  end?: string;
  startPrice?: number;
  endPrice?: number;
  category?: string;
  itemName?: string;
}

// Cart Types
export interface CartItem {
  id: number;
  user: User;
  foodItem: FoodItem;
  quantity: number;
  addedAt: string;
  isDeleted: boolean;
}

export interface UserCartView {
  id: number;
  foodItem: FoodItem;
  quantity: number;
  totalPrice: number;
}

export interface AddItemToCartRequest {
  userId: number;
  foodItemId: number;
  quantity: number;
}

// Order Types
export interface Order {
  id: number;
  user: User;
  totalAmount: number;
  status: 'ORDERED' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';
  orderedAt: string;
  orderItems: OrderItem[];
  address: Address;
  isDeleted: boolean;
}

export interface OrderItem {
  id: number;
  order: Order;
  foodItem: FoodItem;
  quantity: number;
  price: number;
  isDeleted: boolean;
}

// Address Types
export interface Address {
  id: number;
  user: User;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  isDeleted: boolean;
}

// Payment Types
export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  receipt?: string;
}

export interface PaymentVerification {
  paymentId: string;
  orderId: string;
  signature: string;
}

// API Response Types
export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

export interface LoginResponse {
  username: string;
  jwtToken: string;
}

// Analytics Types
export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
}

export interface VegNonVegStats {
  vegOrders: number;
  nonVegOrders: number;
}

export interface ItemOrderStats {
  itemOrders: Record<string, number>;
}

// App State Types
export interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  portalType: 'user' | 'admin';
  isLoading: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface UpdatePasswordForm {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
} 

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  userId: number;
  addressId: number;
  // cartItems removed to avoid circular reference issues
}
 