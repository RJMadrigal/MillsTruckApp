import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../../features/catalog/types/catalog.types';
import { resolveImageUrl } from '../../api/client';
import { useCart } from '../../features/cart/context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onPress }) => {
  const { addToCart } = useCart();
  const { getPriceInfo } = useCurrency();
  const [justAdded, setJustAdded] = useState(false);

  const priceInfo = getPriceInfo(product);
  const imageUrl = resolveImageUrl(product.imageUrl);
  const locationName =
    typeof product.location === 'object' && product.location !== null
      ? product.location.name
      : typeof product.location === 'string'
      ? product.location
      : null;

  const handleAdd = (e: any) => {
    e.stopPropagation?.();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Repuesto: ${product.name}, precio: ${priceInfo.formatted}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={250}
          cachePolicy="memory-disk"
        />

        {/* Badge de Disponibilidad */}
        <View style={[styles.badge, product.inStock !== false ? styles.badgeInStock : styles.badgeOutOfStock]}>
          <Ionicons
            name={product.inStock !== false ? "checkmark-circle" : "time-outline"}
            size={12}
            color={product.inStock !== false ? "#166534" : "#991B1B"}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.badgeText, product.inStock !== false ? styles.badgeTextInStock : styles.badgeTextOutOfStock]}>
            {product.inStock !== false ? 'En Inventario' : 'Bajo Pedido'}
          </Text>
        </View>

        {locationName && (
          <View style={styles.locationBadge}>
            <Ionicons name="location-sharp" size={11} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.locationBadgeText}>
              {locationName.toUpperCase().includes('USA') ? 'USA Yard' : 'Costa Rica'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand || product.category?.name || 'REPUESTO PESADO'}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.priceCol}>
            {product.sku && <Text style={styles.sku}>Cód: {product.sku}</Text>}
            <Text style={styles.price}>
              {priceInfo.formatted}
              {priceInfo.isFallback && ' (USD)'}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              justAdded && styles.addButtonSuccess,
              pressed && styles.addButtonPressed,
            ]}
            onPress={handleAdd}
          >
            <Ionicons
              name={justAdded ? "checkmark" : "add"}
              size={15}
              color="#FFFFFF"
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.addButtonText, justAdded && styles.addButtonTextSuccess]}>
              {justAdded ? 'Agregado' : 'Agregar'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

ProductCard.displayName = 'ProductCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeInStock: {
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeOutOfStock: {
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextInStock: {
    color: '#166534',
  },
  badgeTextOutOfStock: {
    color: '#991B1B',
  },
  locationBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: 14,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  priceCol: {
    flex: 1,
  },
  sku: {
    fontSize: 11,
    color: '#94A3B8',
  },
  price: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonPressed: {
    backgroundColor: '#334155',
  },
  addButtonSuccess: {
    backgroundColor: '#16A34A',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  addButtonTextSuccess: {
    color: '#FFFFFF',
  },
});
