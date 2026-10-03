import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Product } from '../../catalog/types/catalog.types';
import { getProductMaxStock, isTruckProduct } from '../../catalog/utils/productUtils';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextData {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalPriceCRC: number;
}

const CART_STORAGE_KEY = 'mills_cart_items';

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito persistido al iniciar
  useEffect(() => {
    const loadPersistedCart = async () => {
      try {
        const saved = await SecureStore.getItemAsync(CART_STORAGE_KEY);
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (err) {
        console.warn('Error al restaurar carrito local:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadPersistedCart();
  }, []);

  // Persistir cada vez que cambien los ítems de forma compacta (límite 2048 bytes de SecureStore)
  useEffect(() => {
    if (isLoaded) {
      const sanitized = items.map((item) => ({
        quantity: item.quantity,
        product: {
          productId: item.product.productId,
          name: item.product.name ? item.product.name.slice(0, 90) : '',
          sku: item.product.sku || null,
          unitPrice: item.product.unitPrice || 0,
          unitPriceCRC: item.product.unitPriceCRC ?? item.product.UnitPriceCRC ?? null,
          imageUrl: item.product.imageUrl || null,
          inStock: item.product.inStock,
          stockCurrent: item.product.stockCurrent,
          categoryName: item.product.categoryName || item.product.category?.name || null,
          category: item.product.category
            ? { categoryId: item.product.category.categoryId, name: item.product.category.name }
            : null,
          location:
            typeof item.product.location === 'object' && item.product.location !== null
              ? { name: item.product.location.name, code: item.product.location.code }
              : item.product.location || null,
          brand: item.product.brand || null,
          vehicleDetails: item.product.vehicleDetails || item.product.VehicleDetails || null,
        },
      }));

      const payload = JSON.stringify(sanitized);
      if (payload.length < 1950) {
        SecureStore.setItemAsync(CART_STORAGE_KEY, payload).catch((err) => {
          console.warn('Error al guardar carrito:', err);
        });
      } else {
        console.warn('El carrito excede el tamaño máximo permitido para SecureStore');
      }
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1): boolean => {
    const maxStock = getProductMaxStock(product);
    if (maxStock <= 0) {
      return false;
    }

    let success = true;
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.productId === product.productId);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty >= maxStock) {
          success = false;
          return prev;
        }
        const updated = [...prev];
        const newQty = Math.min(maxStock, currentQty + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }

      const initialQty = Math.min(maxStock, Math.max(1, quantity));
      return [...prev, { product, quantity: initialQty }];
    });

    return success;
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.productId === productId) {
          const maxStock = getProductMaxStock(item.product);
          const cappedQty = Math.min(maxStock, Math.max(1, quantity));
          return { ...item, quantity: cappedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((acc, curr) => acc + curr.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((acc, curr) => acc + (curr.product.unitPrice || 0) * curr.quantity, 0),
    [items]
  );

  const totalPriceCRC = useMemo(
    () =>
      items.reduce((acc, curr) => {
        const crc = curr.product.unitPriceCRC ?? curr.product.UnitPriceCRC;
        return acc + (crc && Number(crc) > 0 ? Number(crc) : 0) * curr.quantity;
      }, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalPriceCRC,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};
