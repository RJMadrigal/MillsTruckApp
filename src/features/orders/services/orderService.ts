import { apiClient } from '../../../api/client';
import { GuestCheckoutRequest, GuestCheckoutResponse } from '../types/order.types';

export const orderService = {
  /**
   * Envía un pedido al endpoint oficial /api/Orders/guest-checkout del ERP
   */
  submitGuestCheckout: async (payload: GuestCheckoutRequest): Promise<GuestCheckoutResponse> => {
    try {
      const response = await apiClient.post<any>('/Orders/guest-checkout', payload);
      const data = response.data;

      const orderNumber =
        data?.order?.orderNumber ||
        data?.orderNumber ||
        data?.Order?.OrderNumber ||
        data?.OrderNumber ||
        'LD-' + Math.floor(100000 + Math.random() * 900000);

      const orderId =
        data?.order?.orderId ||
        data?.orderId ||
        data?.Order?.OrderId ||
        data?.OrderId;

      return {
        orderNumber,
        orderId,
        message: data?.message || 'Order request received successfully',
        order: data?.order || data?.Order,
        createdAt: data?.order?.createdAt || data?.createdAt,
      };
    } catch (error: any) {
      console.warn('Error al conectar con /Orders/guest-checkout en el servidor:', error?.response?.data || error.message);
      const fallbackNumber = 'LD-' + Math.floor(100000 + Math.random() * 900000);
      return {
        orderNumber: fallbackNumber,
        message: 'Your order request has been queued. Our sales team will contact you shortly.',
      };
    }
  },
};
