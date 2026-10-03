export interface GuestCheckoutItem {
  productId: number;
  quantity: number;
}

export type ContactMethod = 'WhatsApp' | 'Phone Call' | 'Email' | string;

export interface GuestCheckoutRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredContactMethod?: ContactMethod | string;
  customerAddress?: string;
  notes?: string;
  items: GuestCheckoutItem[];
}

export interface CreatedOrder {
  orderId?: number;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  status?: string;
  subtotal?: number;
  total?: number;
  createdAt?: string;
}

export interface GuestCheckoutResponse {
  message?: string;
  orderNumber: string;
  orderId?: number | string;
  order?: CreatedOrder;
  createdAt?: string;
}
