import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../features/catalog/types/catalog.types';
import { resolveImageUrl } from '../../api/client';
import { useCart } from '../../features/cart/context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

import { isTruckProduct, getProductGallery } from '../../features/catalog/utils/productUtils';

interface CompactProductCardProps {
  product: Product;
  onPress: () => void;
  width?: number | string;
}

export const CompactProductCard: React.FC<CompactProductCardProps> = React.memo(
  ({ product, onPress, width = 165 }) => {
    const { addToCart } = useCart();
    const { getPriceInfo } = useCurrency();
    const [justAdded, setJustAdded] = useState(false);

    const priceInfo = getPriceInfo(product);
    const imageUrl = resolveImageUrl(product.imageUrl);
    const isTruck = isTruckProduct(product);
    const gallery = getProductGallery(product);

    // Ubicaciones oficiales de la empresa: Easton, PA y San José, Costa Rica
    const locationRaw: string =
      typeof product.location === 'object' && product.location !== null
        ? String(product.location.name ?? '')
        : typeof product.location === 'string'
        ? product.location
        : '';

    const isUSA =
      locationRaw.toUpperCase().includes('USA') ||
      locationRaw.toUpperCase().includes('EASTON') ||
      locationRaw.toUpperCase().includes('MIAMI') ||
      (product.productId % 2 === 0);

    const locationDisplay = isUSA ? 'Easton, PA' : 'San José, CR';
    const categoryName = isTruck
      ? 'Truck'
      : product.category?.name || product.brand || 'Part';

    const handleQuickAdd = (e: any) => {
      e.stopPropagation?.();
      addToCart(product, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    };

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { width: width as any },
          pressed && styles.cardPressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${isTruck ? 'Truck' : 'Part'}: ${product.name}, price: ${priceInfo.formatted}`}
      >
        {/* Imagen del repuesto / camión */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />

          {/* Badge de contador de fotos si tiene galería múltiple */}
          {gallery.length > 1 && (
            <View style={styles.photoCountBadge}>
              <Ionicons name="camera" size={10} color="#FFFFFF" style={{ marginRight: 3 }} />
              <Text style={styles.photoCountText}>{gallery.length}</Text>
            </View>
          )}

          {/* Botón flotante rápido para agregar al carrito */}
          <Pressable
            style={[styles.floatingAddBtn, justAdded && styles.floatingAddBtnSuccess]}
            onPress={handleQuickAdd}
          >
            <Ionicons
              name={justAdded ? 'checkmark' : 'add'}
              size={16}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* Contenido exactamente como la referencia */}
        <View style={styles.content}>
          {/* Badge de Categoría (Azul si es Camión, Ámbar si es Repuesto) */}
          <View style={[styles.categoryBadge, isTruck && styles.truckCategoryBadge]}>
            {isTruck && (
              <Ionicons
                name="bus"
                size={10}
                color="#1E40AF"
                style={{ marginRight: 4 }}
              />
            )}
            <Text
              style={[styles.categoryBadgeText, isTruck && styles.truckCategoryBadgeText]}
              numberOfLines={1}
            >
              {categoryName}
            </Text>
          </View>

          {/* Título a 2 líneas */}
          <Text style={styles.title} numberOfLines={2}>
            {product.name}
          </Text>

          {/* Precio azul en negrita */}
          <Text style={styles.price}>
            {priceInfo.formatted}
            {priceInfo.isFallback && (
              <Text style={styles.priceFallbackLabel}> USD</Text>
            )}
          </Text>

          {/* Nombre de la Tienda/Vendedor */}
          <Text style={styles.sellerName} numberOfLines={1}>
            CJ Trucks Parts
          </Text>

          {/* Pin de Ubicación (Easton, PA o San José, CR) */}
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color="#64748B" style={styles.locationIcon} />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationDisplay}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }
);

CompactProductCard.displayName = 'CompactProductCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.96,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  floatingAddBtnSuccess: {
    backgroundColor: '#16A34A',
  },
  content: {
    padding: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  truckCategoryBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  categoryBadgeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  truckCategoryBadgeText: {
    color: '#1E40AF',
  },
  photoCountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  photoCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2563EB', // Azul vibrante de precio como en TruckPartsMart
    marginBottom: 3,
  },
  priceFallbackLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  sellerName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 3,
  },
  locationText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
});
