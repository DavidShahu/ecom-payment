export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  emoji: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface CreateOrderRequest {
  items: { name: string; price: number; quantity: number }[];
  autoCapture: boolean;
  currency?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  checkoutUrl: string | null;
  amount: string;
  currency: string;
  autoCapture: boolean;
}

export interface Order {
  id: string;
  autoCapture: boolean;
  status: OrderStatus;
  amount: string;
  currency: string;
  items: { name: string; price: number; quantity: number }[];
  createdAt: string;
  updatedAt?: string;
  pokData?: any;
  refundedAmount? : number;
}