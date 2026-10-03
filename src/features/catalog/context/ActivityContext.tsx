import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Product } from '../types/catalog.types';

interface ActivityContextData {
  recentlyVisited: Product[];
  mostVisited: Product[];
  recordProductVisit: (product: Product) => void;
}

const RECENT_STORAGE_KEY = 'mills_recent_viewed';
const COUNTS_STORAGE_KEY = 'mills_visit_counts';
const MAX_RECENT_ITEMS = 10;
const MAX_PAYLOAD_BYTES = 1800; // SecureStore on iOS Keychain limit is 2048 bytes

// Clean up product to essential display properties to stay well below 2048 bytes
const compactProduct = (p: Product): Product => ({
  productId: p.productId,
  name: p.name ? p.name.slice(0, 90) : '',
  unitPrice: p.unitPrice || 0,
  unitPriceCRC: p.unitPriceCRC ?? p.UnitPriceCRC ?? null,
  imageUrl: p.imageUrl || null,
  inStock: p.inStock,
  categoryName: p.categoryName || p.category?.name || null,
  category: p.category ? { categoryId: p.category.categoryId, name: p.category.name } : null,
  location:
    typeof p.location === 'object' && p.location !== null
      ? { name: p.location.name, code: p.location.code }
      : p.location || null,
  brand: p.brand || null,
});

const ActivityContext = createContext<ActivityContextData>({} as ActivityContextData);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyVisited, setRecentlyVisited] = useState<Product[]>([]);
  const [visitCounts, setVisitCounts] = useState<Record<number, number>>({});

  // Cargar historial de actividad persistido
  useEffect(() => {
    const loadPersistedActivity = async () => {
      try {
        const [recentSaved, countsSaved] = await Promise.all([
          SecureStore.getItemAsync(RECENT_STORAGE_KEY),
          SecureStore.getItemAsync(COUNTS_STORAGE_KEY),
        ]);

        if (recentSaved) {
          setRecentlyVisited(JSON.parse(recentSaved));
        }
        if (countsSaved) {
          setVisitCounts(JSON.parse(countsSaved));
        }
      } catch (err) {
        console.warn('Error al cargar actividad reciente:', err);
      }
    };

    loadPersistedActivity();
  }, []);

  // Registrar visita de un producto
  const recordProductVisit = useCallback((product: Product) => {
    if (!product || !product.productId) return;

    setRecentlyVisited((prev) => {
      // Compactar y remover si ya existía para ponerlo al principio (más reciente)
      const sanitized = compactProduct(product);
      const filtered = prev.filter((p) => p.productId !== product.productId);
      let updated = [sanitized, ...filtered].slice(0, MAX_RECENT_ITEMS);

      // Garantizar que el payload serializado nunca exceda el límite de iOS Keychain
      let payload = JSON.stringify(updated);
      while (payload.length > MAX_PAYLOAD_BYTES && updated.length > 1) {
        updated.pop();
        payload = JSON.stringify(updated);
      }

      SecureStore.setItemAsync(RECENT_STORAGE_KEY, payload).catch((e) =>
        console.warn('Error guardando recientes:', e)
      );

      return updated;
    });

    setVisitCounts((prev) => {
      const currentCount = prev[product.productId] || 0;
      const updated = { ...prev, [product.productId]: currentCount + 1 };

      // Solo persistir conteos de ítems recientes para evitar crecimiento desmedido
      const prunedCounts: Record<number, number> = {};
      const keys = Object.keys(updated).slice(-MAX_RECENT_ITEMS);
      for (const k of keys) {
        prunedCounts[Number(k)] = updated[Number(k)];
      }

      SecureStore.setItemAsync(COUNTS_STORAGE_KEY, JSON.stringify(prunedCounts)).catch((e) =>
        console.warn('Error guardando conteo de visitas:', e)
      );

      return updated;
    });
  }, []);

  // Calcular los más visitados a partir de recentlyVisited ordenados por conteo
  const mostVisited = useMemo(() => {
    if (recentlyVisited.length === 0) return [];
    return [...recentlyVisited].sort((a, b) => {
      const countA = visitCounts[a.productId] || 0;
      const countB = visitCounts[b.productId] || 0;
      return countB - countA;
    });
  }, [recentlyVisited, visitCounts]);

  const value = useMemo(
    () => ({
      recentlyVisited,
      mostVisited,
      recordProductVisit,
    }),
    [recentlyVisited, mostVisited, recordProductVisit]
  );

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity debe ser usado dentro de un ActivityProvider');
  }
  return context;
};
