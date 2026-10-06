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

/**
 * Retorna la cantidad máxima disponible de un producto o camión.
 * Para camiones o vehículos únicos, el límite es 1.
 * Para repuestos, toma en cuenta stockCurrent de la API (o 99 por defecto).
 */
export const getProductMaxStock = (product: Product): number => {
  if (!product) return 1;

  // 1. Si es camión comercial, la unidad es única por definición (stock máximo 1)
  if (isTruckProduct(product)) {
    return 1;
  }

  // 2. Si la API indica explícitamente el stock disponible
  const rawStock =
    product.stockCurrent ??
    (product as any).StockCurrent ??
    (product as any).stock ??
    (product as any).Stock;

  if (typeof rawStock === 'number' && !isNaN(rawStock)) {
    return Math.max(0, Math.floor(rawStock));
  }

  // 3. Si inStock viene como falso, no hay existencias
  if (product.inStock === false) {
    return 0;
  }

  // 4. Límite razonable por defecto para repuestos con inventario no especificado
  return 99;
};

/**
 * Retorna un ícono temático y coherente de MaterialCommunityIcons
 * para cada categoría del catálogo.
 */
export const getCategoryIcon = (categoryName?: string | null): string => {
  if (!categoryName) return 'package-variant-closed';
  const n = categoryName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (n.includes('camion') || n.includes('truck') || n.includes('cabezal')) return 'truck';
  if (n.includes('motor') || n.includes('engine')) return 'engine-outline';
  if (n.includes('turbo')) return 'turbine';
  if (n.includes('freno') || n.includes('brake') || n.includes('zapata')) return 'car-brake-alert';
  if (n.includes('transmi') || n.includes('gear') || n.includes('clutch') || n.includes('embrague')) return 'cog-outline';
  if (n.includes('llanta') || n.includes('tire') || n.includes('rueda') || n.includes('neumatic')) return 'tire';
  if (n.includes('hidraul') || n.includes('hydraul') || n.includes('bomba')) return 'gauge';
  if (n.includes('cabina') || n.includes('cabin') || n.includes('carrocer')) return 'car-door';
  if (n.includes('chasis') || n.includes('chassi') || n.includes('frame')) return 'car-traction-control';
  if (n.includes('accesori') || n.includes('accessori') || n.includes('herramienta') || n.includes('tool')) return 'tools';
  if (n.includes('suspens') || n.includes('eje') || n.includes('axle') || n.includes('difer')) return 'car-traction-control';
  if (n.includes('inyec') || n.includes('combust') || n.includes('fuel')) return 'gas-station';
  if (n.includes('filtro') || n.includes('oil') || n.includes('aceite')) return 'oil';
  if (n.includes('electr') || n.includes('luz') || n.includes('sensor') || n.includes('flash')) return 'flash-outline';
  if (n.includes('otro') || n.includes('other') || n.includes('misc')) return 'dots-horizontal-circle-outline';

  return 'package-variant-closed';
};
