import axios from 'axios';

// Base URL resolved dynamically via environment variables (EXPO_PUBLIC_API_URL)
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, '') || 'https://api.millstruckservices.com';
export const API_BASE_URL = `${BASE_URL}/api`;
export const AUTH_TOKEN_KEY = 'mills_auth_token';
export const REFRESH_TOKEN_KEY = 'mills_refresh_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Resuelve la URL de una imagen. Si viene como ruta relativa (ej. "uploads/products/foto.png"),
 * la concatena con la BASE_URL. Si ya es una URL absoluta (http/https), la devuelve intacta.
 */
export const resolveImageUrl = (path?: string | null): string => {
  if (!path || path.trim() === '') {
    // Imagen de respaldo si no hay imagen en el backend
    return 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80';
  }

  const cleanPath = path.trim();
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    return cleanPath;
  }

  // Si la ruta relativa comienza con '/', evitar doble slash
  if (cleanPath.startsWith('/')) {
    return `${BASE_URL}${cleanPath}`;
  }

  return `${BASE_URL}/${cleanPath}`;
};
