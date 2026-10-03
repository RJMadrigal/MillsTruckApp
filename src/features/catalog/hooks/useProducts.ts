import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductFilters } from '../types/catalog.types';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 15, // 15 minutos de caché
  });
};

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id && id > 0),
  });
};
