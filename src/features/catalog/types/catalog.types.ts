export interface Category {
  categoryId: number;
  name: string;
  description?: string;
  productsCount?: number;
}

export interface LocationInfo {
  locationId?: number;
  name?: string;
  code?: string;
}

export interface CategoryInfo {
  categoryId: number;
  name: string;
}

export interface VehicleDetails {
  make?: string | null;
  model?: string | null;
  year?: number | string | null;
  vin?: string | null;
  mileage?: number | string | null;
  engine?: string | null;
  transmission?: string | null;
  // Soporte para serialización en PascalCase
  Make?: string | null;
  Model?: string | null;
  Year?: number | string | null;
  VIN?: string | null;
  Mileage?: number | string | null;
  Engine?: string | null;
  Transmission?: string | null;
}

export interface Product {
  productId: number;
  name: string;
  sku?: string | null;
  description?: string | null;
  unitPrice: number;
  unitPriceCRC?: number | null;
  UnitPriceCRC?: number | null;
  imageUrl?: string | null;
  inStock?: boolean;
  stockCurrent?: number;
  unitOfMeasure?: string;
  isFeatured?: boolean;
  category?: CategoryInfo | null;
  categoryId?: number | null;
  categoryName?: string | null;
  location?: LocationInfo | string | null;
  brand?: string | null;
  features?: string[] | null;
  // Propiedades nuevas para Camiones y Repuestos con Galería
  gallery?: string[] | null;
  Gallery?: string[] | null;
  vehicleDetails?: VehicleDetails | null;
  VehicleDetails?: VehicleDetails | null;
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProductsResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize?: number;
  totalPages: number;
}
