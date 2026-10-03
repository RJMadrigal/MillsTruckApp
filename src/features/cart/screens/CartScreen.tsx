import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../navigation/types';
import { useCart, CartItem } from '../context/CartContext';
import { resolveImageUrl } from '../../../api/client';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { getProductMaxStock, isTruckProduct } from '../../catalog/utils/productUtils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { t, isSpanish } = useLanguage();
  const { currency, getPriceInfo, formatAmount } = useCurrency();

  const activeTotalDisplay = useMemo(() => {
    if (currency === 'CRC') {
      let crcTotal = 0;
      let usdFallbackTotal = 0;
      items.forEach((item) => {
        const info = getPriceInfo(item.product);
        if (info.currency === 'CRC') {
          crcTotal += info.amount * item.quantity;
        } else {
          usdFallbackTotal += info.amount * item.quantity;
        }
      });

      if (crcTotal > 0 && usdFallbackTotal > 0) {
        return `${formatAmount(crcTotal, 'CRC')} + $${usdFallbackTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;
      }
      if (crcTotal > 0) {
        return formatAmount(crcTotal, 'CRC');
      }
      return `$${usdFallbackTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }
    return `$${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }, [items, currency, getPriceInfo, formatAmount, totalPrice]);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={72} color="#94A3B8" style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>{t('empty_request')}</Text>
          <Text style={styles.emptySubtitle}>
            {t('start_browsing')}
          </Text>
          <Pressable
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('MainTabs', { screen: 'CatalogTab' } as any)}
          >
            <Ionicons name="grid-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.exploreBtnText}>{t('explore_catalog')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEyebrow}>
            {isSpanish ? 'CARRITO DE COMPRAS' : 'SHOPPING CART'}
          </Text>
          <Text style={styles.headerTitle}>
            {isSpanish ? `Mi Carrito (${totalItems})` : `My Cart (${totalItems})`}
          </Text>
        </View>
        <Pressable onPress={clearCart} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={13} color="#DC2626" style={{ marginRight: 4 }} />
          <Text style={styles.clearBtnText}>{isSpanish ? 'Vaciar' : 'Clear'}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lista de Ítems */}
        <View style={styles.itemsList}>
          {items.map(({ product, quantity }: CartItem) => {
            const priceInfo = getPriceInfo(product);
            const imgUri = resolveImageUrl(product.imageUrl);
            const maxStock = getProductMaxStock(product);
            const isTruck = isTruckProduct(product);
            const isMaxReached = quantity >= maxStock;

            const handleIncrease = () => {
              if (isMaxReached) {
                if (isTruck) {
                  Alert.alert(
                    isSpanish ? 'Unidad Única' : 'Single Unit',
                    isSpanish
                      ? 'Este camión es una unidad única disponible en inventario.'
                      : 'This truck is a unique single unit available in inventory.'
                  );
                } else {
                  Alert.alert(
                    isSpanish ? 'Límite de Existencias' : 'Stock Limit',
                    isSpanish
                      ? `Solo hay ${maxStock} unidades disponibles de este repuesto en inventario.`
                      : `Only ${maxStock} units available for this part in inventory.`
                  );
                }
                return;
              }
              updateQuantity(product.productId, quantity + 1);
            };

            return (
              <View key={product.productId} style={styles.cartCard}>
                <Image
                  source={{ uri: imgUri }}
                  style={styles.thumb}
                  contentFit="cover"
                  transition={200}
                />

                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Pressable
                      style={styles.removeBtn}
                      onPress={() => removeFromCart(product.productId)}
                    >
                      <Ionicons name="trash-outline" size={15} color="#DC2626" />
                    </Pressable>
                  </View>

                  <View style={styles.skuRow}>
                    {product.sku && <Text style={styles.itemSku}>Code: {product.sku}</Text>}
                    {isTruck ? (
                      <View style={styles.stockNoticePill}>
                        <Ionicons name="bus-outline" size={11} color="#1D4ED8" style={{ marginRight: 3 }} />
                        <Text style={styles.stockNoticePillText}>
                          {isSpanish ? 'Unidad única' : 'Single unit'}
                        </Text>
                      </View>
                    ) : maxStock <= 10 && maxStock > 0 ? (
                      <View style={[styles.stockNoticePill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                        <Text style={[styles.stockNoticePillText, { color: '#B45309' }]}>
                          {isSpanish ? `Máx: ${maxStock}` : `Max: ${maxStock}`}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.cardBottomRow}>
                    <Text style={styles.itemPrice}>
                      {priceInfo.formatted}
                      {priceInfo.isFallback && (
                        <Text style={styles.itemFallbackText}> USD</Text>
                      )}
                    </Text>

                    {/* Selector de Cantidad */}
                    <View style={styles.qtyContainer}>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(product.productId, quantity - 1)}
                      >
                        <Ionicons name="remove" size={15} color="#0F172A" />
                      </Pressable>
                      <Text style={styles.qtyText}>{quantity}</Text>
                      <Pressable
                        style={[styles.qtyBtn, isMaxReached && styles.qtyBtnDisabled]}
                        onPress={handleIncrease}
                      >
                        <Ionicons
                          name="add"
                          size={15}
                          color={isMaxReached ? '#CBD5E1' : '#0F172A'}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Resumen de Precios */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>
            {isSpanish ? 'Resumen del Carrito' : 'Cart Summary'}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {isSpanish ? 'Total de repuestos:' : 'Total items:'}
            </Text>
            <Text style={styles.summaryValue}>
              {totalItems} {isSpanish ? 'unidades' : 'units'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {isSpanish ? 'Almacén de origen:' : 'Origin warehouse:'}
            </Text>
            <Text style={styles.summaryValue}>Easton, PA / San José, CR</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <Text style={styles.totalLabel}>
              {isSpanish ? `Total Estimado (${currency}):` : `Estimated Total (${currency}):`}
            </Text>
            <Text style={styles.totalValue}>
              {activeTotalDisplay}
            </Text>
          </View>
          <Text style={styles.summaryNote}>
            {isSpanish
              ? '* Los precios finales, fletes e impuestos se confirmarán directamente con el equipo de ventas al procesar la cotización.'
              : '* Final pricing, shipping fees, and availability will be confirmed directly by the sales team upon request receipt.'}
          </Text>
        </View>
      </ScrollView>

      {/* Botón Flotante para ir al Checkout */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.checkoutBtn, pressed && styles.checkoutBtnPressed]}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutBtnText}>
            {isSpanish ? 'Continuar con el Pedido' : 'Continue to Checkout'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  itemsList: {
    gap: 12,
    marginBottom: 20,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  removeBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  itemSku: {
    fontSize: 11,
    color: '#94A3B8',
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  stockNoticePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stockNoticePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemFallbackText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.35,
    backgroundColor: '#F1F5F9',
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  qtyText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2563EB',
  },
  summaryNote: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  checkoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutBtnPressed: {
    backgroundColor: '#1E293B',
    transform: [{ scale: 0.99 }],
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
