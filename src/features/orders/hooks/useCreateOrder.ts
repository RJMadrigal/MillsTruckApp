import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { GuestCheckoutRequest, GuestCheckoutResponse } from '../types/order.types';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<GuestCheckoutResponse, Error, GuestCheckoutRequest>({
    mutationFn: (data: GuestCheckoutRequest) => orderService.submitGuestCheckout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
