import { apiClient } from '../../../api/client';
import { Category, Product, ProductFilters, PaginatedProductsResponse } from '../types/catalog.types';

// Datos de respaldo en caso de desconexión momentánea de red
const FALLBACK_CATEGORIES: Category[] = [
  { categoryId: 0, name: 'Todos los Repuestos', description: 'Catálogo completo' },
  { categoryId: 1, name: 'Motores y Turbos', description: 'Detroit, Cummins, Caterpillar' },
  { categoryId: 2, name: 'Transmisiones y Embragues', description: 'Eaton Fuller, Meritor' },
  { categoryId: 3, name: 'Frenos de Aire', description: 'Bendix, zapatas, válvulas' },
  { categoryId: 4, name: 'Inyección Diésel', description: 'Inyectores y bombas de alta presión' },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    productId: 1,
    name: 'Turbocargador Holset HE400VG Detroit DD15',
    unitPrice: 1850.0,
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
    inStock: true,
    sku: 'TURBO-DD15',
    categoryId: 1,
    category: { categoryId: 1, name: 'Motores y Turbos' },
    brand: 'Detroit Diesel / Holset',
    description: 'Turbocargador de geometría variable genuino. Compatible con Freightliner Cascadia y Western Star con motor Detroit DD15 EPA10.',
    location: 'USA',
    features: ['Actuador electrónico calibrado', 'Garantía 12 meses', 'Balanceo de alta precisión']
  },
  {
    productId: 2,
    name: 'Kit de Embrague Eaton Fuller Advantage 15.5"',
    unitPrice: 980.0,
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80',
    inStock: true,
    sku: 'CLUTCH-2050',
    categoryId: 2,
    category: { categoryId: 2, name: 'Transmisiones y Embragues' },
    brand: 'Eaton Fuller',
    description: 'Embrague autoajustable de cerámica de 6 resortes para aplicaciones severas de hasta 2050 lb-ft.',
    location: 'CR',
    features: ['Autoajustable', 'Pastillas cerámicas', 'Para transmisiones de 10, 13 y 18 vel']
  },
  {
    productId: 3,
    name: 'Inyector Common Rail Cummins ISX15 X15',
    unitPrice: 495.0,
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    inStock: true,
    sku: 'INJ-ISX15',
    categoryId: 4,
    category: { categoryId: 4, name: 'Inyección Diésel' },
    brand: 'Cummins',
    description: 'Inyector de combustible diésel calibrado a especificación OEM de alta presión.',
    location: 'USA',
    features: ['Punta microperforada', 'Sellos nuevos incluidos', 'Código QR de calibración']
  },
  {
    productId: 4,
    name: 'Juego de Zapatas de Freno Bendix ES 4707Q',
    unitPrice: 135.0,
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    inStock: true,
    sku: 'BRAKE-4707Q',
    categoryId: 3,
    category: { categoryId: 3, name: 'Frenos de Aire' },
    brand: 'Bendix',
    description: 'Zapatas para freno de aire tambor 16.5" x 7". Material grado 23K GAWR para carretera y montaña.',
    location: 'CR',
    features: ['Grado 23K GAWR', 'Incluye kit de resortes', 'Certificación FMVSS 121']
  }
];

export const productService = {
  /**
   * Obtiene la lista de categorías activas desde /api/Catalog/categories
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      const { data } = await apiClient.get<Category[]>('/Catalog/categories');
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn('Fallo al conectar con /Catalog/categories, usando respaldo local:', error);
    }
    return FALLBACK_CATEGORIES;
  },

  /**
   * Obtiene productos con paginación y filtros desde /api/Catalog/products
   */
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedProductsResponse> => {
    try {
      const params: Record<string, any> = {
        page: filters.page || 1,
        pageSize: filters.pageSize || 20,
      };

      if (filters.search && filters.search.trim() !== '') {
        params.search = filters.search.trim();
      }

      if (filters.categoryId && filters.categoryId > 0) {
        params.categoryId = filters.categoryId;
      }

      const { data } = await apiClient.get<PaginatedProductsResponse | Product[]>('/Catalog/products', { params });

      // Si el backend devuelve un objeto paginado { items, totalCount, page, totalPages }
      if (data && 'items' in data && Array.isArray(data.items)) {
        return data as PaginatedProductsResponse;
      }

      // Si el backend devuelve un array simple
      if (Array.isArray(data)) {
        return {
          items: data,
          totalCount: data.length,
          page: filters.page || 1,
          totalPages: Math.ceil(data.length / (filters.pageSize || 20)) || 1,
        };
      }
    } catch (error) {
      console.warn('Fallo al conectar con /Catalog/products, usando respaldo local:', error);
    }

    // Filtrado local de respaldo si la API aún no está disponible
    let filtered = [...FALLBACK_PRODUCTS];

    if (filters.categoryId && filters.categoryId > 0) {
      filtered = filtered.filter(
        (p) => p.categoryId === filters.categoryId || p.category?.categoryId === filters.categoryId
      );
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    return {
      items: filtered,
      totalCount: filtered.length,
      page: 1,
      totalPages: 1,
    };
  },

  /**
   * Obtiene el detalle de un producto específico desde /api/Catalog/products/{id}
   */
  getProductById: async (id: number): Promise<Product> => {
    try {
      const { data } = await apiClient.get<Product>(`/Catalog/products/${id}`);
      return data;
    } catch (error) {
      console.warn(`Fallo al consultar /Catalog/products/${id}:`, error);
      const found = FALLBACK_PRODUCTS.find((p) => p.productId === id);
      if (found) return found;
      throw error;
    }
  },
};
