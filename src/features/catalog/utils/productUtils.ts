import { Product, VehicleDetails } from '../types/catalog.types';
import { resolveImageUrl } from '../../../api/client';

export interface NormalizedVehicleDetails {
  make?: string;
  model?: string;
  year?: string | number;
  vin?: string;
  mileage?: string | number;
  engine?: string;
  transmission?: string;
}

/**
 * Normaliza y resuelve todas las fotos de un producto / camión.
 * Concatena BASE_URL a rutas relativas (ej. /uploads/products/foto.png).
 */
export const getProductGallery = (product: Product): string[] => {
  if (!product) return [resolveImageUrl(null)];

  const rawList: string[] = [];

  // 1. Añadir imagen principal si existe
  if (product.imageUrl && product.imageUrl.trim() !== '') {
    rawList.push(product.imageUrl.trim());
  }

  // 2. Añadir fotos de Gallery (soportando camelCase y PascalCase)
  const gallery = product.gallery || product.Gallery;
  if (Array.isArray(gallery) && gallery.length > 0) {
    for (const item of gallery) {
      if (typeof item === 'string' && item.trim() !== '') {
        rawList.push(item.trim());
      }
    }
  }

  // 3. Resolver URLs completas con BASE_URL y deduplicar
  const resolvedList: string[] = [];
  for (const raw of rawList) {
    const resolved = resolveImageUrl(raw);
    if (!resolvedList.includes(resolved)) {
      resolvedList.push(resolved);
    }
  }

  // Si no hay ninguna foto válida, retornar fallback oficial
  if (resolvedList.length === 0) {
    resolvedList.push(resolveImageUrl(null));
  }

  return resolvedList;
};

/**
 * Determina si un producto es un camión / cabezal completo o un repuesto
 */
export const isTruckProduct = (product: Product): boolean => {
  if (!product) return false;

  if (product.vehicleDetails || product.VehicleDetails) {
    return true;
  }

  const categoryName = (
    product.category?.name ||
    product.categoryName ||
    ''
  ).toLowerCase();

  if (categoryName.includes('camion') || categoryName.includes('truck')) {
    return true;
  }

  const sku = (product.sku || '').toUpperCase();
  if (sku.startsWith('TRK') || sku.startsWith('CAMION')) {
    return true;
  }

  return false;
};

/**
 * Extrae y normaliza la ficha técnica del camión.
 * Si vehicleDetails viene en null pero el producto es un camión con ficha en su descripción,
 * parsea los campos para mostrar la tarjeta técnica de forma atractiva.
 */
export const getVehicleDetails = (product: Product): NormalizedVehicleDetails | null => {
  if (!product) return null;

  const raw: VehicleDetails | null | undefined = product.vehicleDetails || product.VehicleDetails;

  if (raw && typeof raw === 'object') {
    const make = raw.make || raw.Make || undefined;
    const model = raw.model || raw.Model || undefined;
    const year = raw.year || raw.Year || undefined;
    const vin = raw.vin || raw.VIN || undefined;
    const mileage = raw.mileage || raw.Mileage || undefined;
    const engine = raw.engine || raw.Engine || undefined;
    const transmission = raw.transmission || raw.Transmission || undefined;

    return {
      make: make || undefined,
      model: model || undefined,
      year: year || undefined,
      vin: vin || undefined,
      mileage: mileage || undefined,
      engine: engine || undefined,
      transmission: transmission || undefined,
    };
  }

  // Si no viene el objeto vehicleDetails pero sabemos que es de la categoría Camiones,
  // intentar extraer campos comunes de la descripción si existen
  if (isTruckProduct(product)) {
    const desc = product.description || '';
    const details: NormalizedVehicleDetails = {};

    // Extraer Motor
    const motorMatch = desc.match(/Motor:\s*([^\r\n]+)/i);
    if (motorMatch) details.engine = motorMatch[1].trim();

    // Extraer Transmisión
    const transMatch = desc.match(/Transmisi[oó]n:\s*([^\r\n]+)/i);
    if (transMatch) details.transmission = transMatch[1].trim();

    // Extraer Millaje / Kilometraje
    const mileageMatch = desc.match(/([0-9,.]+\s*(?:mi|km|millas|kilómetros)[^\r\n]*)/i);
    if (mileageMatch) details.mileage = mileageMatch[1].trim();

    // Extraer VIN / Chasis o SKU
    if (product.sku) {
      details.vin = product.sku.trim();
    }

    // Marca y Modelo desde el nombre
    const nameParts = product.name.split(' ');
    if (nameParts.length >= 2) {
      details.make = nameParts[0];
      details.model = nameParts.slice(1).join(' ');
    } else {
      details.make = product.name;
    }

    return details;
  }

  return null;
};
