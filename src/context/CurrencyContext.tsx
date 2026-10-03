import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

export type Currency = 'USD' | 'CRC';

const CURRENCY_STORAGE_KEY = 'mills_currency_preference';

export interface ProductPriceSource {
  unitPrice?: number | null;
  unitPriceCRC?: number | null;
  UnitPriceCRC?: number | null;
}

export interface PriceDisplayInfo {
  formatted: string;       // e.g. "₡23,500.00" or "$45.00"
  amount: number;          // 23500 or 45
  currency: Currency;      // Active currency used for display
  symbol: string;          // "$" or "₡"
  isFallback: boolean;     // true if user chose CRC but product only has USD
  hasCRC: boolean;         // true if product has a valid Colones price
  crcAmount: number | null;
  usdAmount: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => Promise<void>;
  toggleCurrency: () => Promise<void>;
  isCRC: boolean;
  getPriceInfo: (product?: ProductPriceSource | null) => PriceDisplayInfo;
  formatAmount: (amount: number, targetCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  // Cargar preferencia guardada
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const saved = await SecureStore.getItemAsync(CURRENCY_STORAGE_KEY);
        if (saved === 'USD' || saved === 'CRC') {
          setCurrencyState(saved);
        }
      } catch (err) {
        console.warn('Error cargando preferencia de moneda:', err);
      }
    };
    loadCurrency();
  }, []);

  const setCurrency = useCallback(async (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      await SecureStore.setItemAsync(CURRENCY_STORAGE_KEY, newCurrency);
    } catch (err) {
      console.warn('Error guardando preferencia de moneda:', err);
    }
  }, []);

  const toggleCurrency = useCallback(async () => {
    const next = currency === 'USD' ? 'CRC' : 'USD';
    await setCurrency(next);
  }, [currency, setCurrency]);

  const formatAmount = useCallback(
    (amount: number, targetCurrency?: Currency): string => {
      const c = targetCurrency || currency;
      const formattedNum = (amount || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return c === 'CRC' ? `₡${formattedNum}` : `$${formattedNum}`;
    },
    [currency]
  );

  const getPriceInfo = useCallback(
    (product?: ProductPriceSource | null): PriceDisplayInfo => {
      const usdAmount = Number(product?.unitPrice) || 0;
      const rawCrc = product?.unitPriceCRC ?? product?.UnitPriceCRC ?? null;
      const crcNum = rawCrc !== null && rawCrc !== undefined ? Number(rawCrc) : null;
      const hasCRC = crcNum !== null && !isNaN(crcNum) && crcNum > 0;

      if (currency === 'CRC') {
        if (hasCRC) {
          return {
            formatted: `₡${(crcNum!).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            amount: crcNum!,
            currency: 'CRC',
            symbol: '₡',
            isFallback: false,
            hasCRC: true,
            crcAmount: crcNum,
            usdAmount,
          };
        } else {
          // Fallback a Dólares
          return {
            formatted: `$${usdAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            amount: usdAmount,
            currency: 'USD',
            symbol: '$',
            isFallback: true,
            hasCRC: false,
            crcAmount: null,
            usdAmount,
          };
        }
      }

      // Default USD
      return {
        formatted: `$${usdAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        amount: usdAmount,
        currency: 'USD',
        symbol: '$',
        isFallback: false,
        hasCRC,
        crcAmount: hasCRC ? crcNum : null,
        usdAmount,
      };
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        toggleCurrency,
        isCRC: currency === 'CRC',
        getPriceInfo,
        formatAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
