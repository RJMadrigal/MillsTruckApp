import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
  Linking,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../navigation/types';
import { useCart } from '../../cart/context/CartContext';
import { useActivity } from '../context/ActivityContext';
import { useProduct } from '../hooks/useProducts';
import {
  getProductGallery,
  getVehicleDetails,
  isTruckProduct,
  getProductMaxStock,
} from '../utils/productUtils';
import { Product } from '../types/catalog.types';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useCurrency } from '../../../context/CurrencyContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RouteProps = RouteProp<RootStackParamList, 'ProductDetail'>;
type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavProps>();
  const insets = useSafeAreaInsets();
  const { product: initialProduct } = route.params;
  const { t, isSpanish, translateCategory } = useLanguage();
  const { getPriceInfo, formatAmount, currency } = useCurrency();

  // Consulta al endpoint específico /api/Catalog/products/{id} para tener datos frescos (Gallery, VehicleDetails)
  const { data: freshProduct } = useProduct(initialProduct.productId);
  const product: Product = freshProduct || initialProduct;
  const priceInfo = getPriceInfo(product);

  const { items, addToCart } = useCart();
  const { recordProductVisit } = useActivity();

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const galleryScrollRef = useRef<ScrollView>(null);

  // Registrar visita para 'Your Activity'
  React.useEffect(() => {
    if (product) {
      recordProductVisit(product);
    }
  }, [product, recordProductVisit]);

  // Lista de todas las fotos normalizadas
  const galleryImages = getProductGallery(product);
  const isTruck = isTruckProduct(product);
  const vehicleDetails = getVehicleDetails(product);
  const maxStock = getProductMaxStock(product);

  // Cantidad ya presente en el carrito para este producto
  const existingCartItem = items.find((i) => i.product.productId === product.productId);
  const currentInCart = existingCartItem ? existingCartItem.quantity : 0;

  const locationName =
    typeof product.location === 'object' && product.location !== null
      ? product.location.name
      : typeof product.location === 'string'
      ? product.location
      : null;

  const isUSA =
    (locationName && locationName.toUpperCase().includes('USA')) ||
    (locationName && locationName.toUpperCase().includes('EASTON')) ||
    product.productId % 2 === 0;

  const locationDisplay = isUSA
    ? (isSpanish ? 'Patio Easton, PA (USA)' : 'Easton, PA Yard')
    : (isSpanish ? 'Bodega San José, CR' : 'San José, CR Warehouse');

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slide !== activeImageIndex && slide >= 0 && slide < galleryImages.length) {
      setActiveImageIndex(slide);
    }
  };

  const handleSelectThumbnail = (index: number) => {
    setActiveImageIndex(index);
    galleryScrollRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  const handleOpenFullscreen = (index: number) => {
    setModalImageIndex(index);
    setIsModalVisible(true);
  };

  const handleAddToCart = () => {
    if (maxStock <= 0) {
      Alert.alert(
        isSpanish ? 'Sin Existencias' : 'Out of Stock',
        isSpanish
          ? 'Este producto no cuenta con existencias disponibles en este momento.'
          : 'This item is currently out of stock.'
      );
      return;
    }

    if (currentInCart >= maxStock) {
      if (isTruck) {
        Alert.alert(
          isSpanish ? 'Vehículo ya en el carrito' : 'Truck already in cart',
          isSpanish
            ? 'Este camión ya se encuentra en tu carrito. Al ser una unidad única, no es posible agregar más.'
            : 'This truck is already in your cart. As a single vehicle, you cannot add more.'
        );
      } else {
        Alert.alert(
          isSpanish ? 'Límite alcanzado' : 'Limit reached',
          isSpanish
            ? `Ya tienes las ${maxStock} unidades disponibles en tu carrito.`
            : `You already have all ${maxStock} available units in your cart.`
        );
      }
      return;
    }

    const availableToAdd = maxStock - currentInCart;
    const qtyToAdd = Math.min(quantity, availableToAdd);

    const added = addToCart(product, qtyToAdd);
    if (added) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 1500);
      if (qtyToAdd < quantity) {
        Alert.alert(
          isSpanish ? 'Cantidad ajustada' : 'Quantity adjusted',
          isSpanish
            ? `Solo se agregaron ${qtyToAdd} unidad(es) porque se alcanzó el stock máximo disponible (${maxStock}).`
            : `Only ${qtyToAdd} unit(s) added as maximum available stock (${maxStock}) was reached.`
        );
      }
    }
  };

  const handleBuyNow = () => {
    if (maxStock <= 0) {
      Alert.alert(
        isSpanish ? 'Sin Existencias' : 'Out of Stock',
        isSpanish
          ? 'Este producto no cuenta con existencias disponibles en este momento.'
          : 'This item is currently out of stock.'
      );
      return;
    }

    if (currentInCart < maxStock) {
      const availableToAdd = maxStock - currentInCart;
      addToCart(product, Math.min(quantity, availableToAdd));
    }
    navigation.navigate('Checkout');
  };

  const handleWhatsAppTruckInquiry = () => {
    const vinText = vehicleDetails?.vin ? ` (VIN: ${vehicleDetails.vin})` : '';
    const text = encodeURIComponent(
      isSpanish
        ? `Hola CJ Trucks Parts, estoy interesado en ${product.name}${vinText}.`
        : `Hello CJ Trucks Parts, I am interested in ${product.name}${vinText}.`
    );
    Linking.openURL(`https://wa.me/50670334308?text=${text}`);
  };

  const handleShowVin = (vin: string) => {
    Alert.alert(
      isSpanish ? 'Número de Chasis / VIN' : 'Chassis Number / VIN',
      `VIN: ${vin}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Top Nav */}
      <View style={styles.topNav}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Back to catalog"
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>
        <Text style={styles.navTitle} numberOfLines={1}>
          {isTruck
            ? t('truck_details')
            : product.brand || t('product_details')}
        </Text>
        <Pressable
          style={styles.cartIconBtn}
          onPress={() => navigation.navigate('CartTab' as any)}
          accessibilityRole="button"
          accessibilityLabel="View cart"
        >
          <Ionicons name="cart-outline" size={22} color="#0F172A" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Carrusel de Fotos Interactivo con Galería Completa */}
        <View style={styles.imageCarouselContainer}>
          <ScrollView
            ref={galleryScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.carouselScroll}
          >
            {galleryImages.map((uri, index) => (
              <Pressable
                key={`img-${index}`}
                style={styles.carouselSlide}
                onPress={() => handleOpenFullscreen(index)}
              >
                <Image
                  source={{ uri }}
                  style={styles.heroImage}
                  contentFit="cover"
                  transition={250}
                  cachePolicy="memory-disk"
                />
              </Pressable>
            ))}
          </ScrollView>

          {/* Badge de Stock en la esquina superior derecha */}
          <View
            style={[
              styles.stockTag,
              product.inStock !== false ? styles.stockTagIn : styles.stockTagOut,
            ]}
          >
            <Ionicons
              name={product.inStock !== false ? 'checkmark-circle' : 'time-outline'}
              size={13}
              color={product.inStock !== false ? '#166534' : '#991B1B'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.stockTagText,
                product.inStock !== false ? styles.stockTagTextIn : styles.stockTagTextOut,
              ]}
            >
              {product.inStock !== false
                ? isTruck
                  ? isSpanish
                    ? 'Disponible'
                    : 'Available'
                  : t('in_stock')
                : isSpanish
                ? 'Bajo Pedido'
                : 'On Request'}
            </Text>
          </View>

          {/* Badge de tipo: TRUCK vs PART en la esquina superior izquierda */}
          {isTruck && (
            <View style={styles.truckTypeBadge}>
              <Ionicons name="bus" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.truckTypeBadgeText}>
                {isSpanish ? 'CAMIÓN COMERCIAL' : 'COMMERCIAL TRUCK'}
              </Text>
            </View>
          )}

          {/* Contador de fotos en la esquina inferior derecha */}
          {galleryImages.length > 1 && (
            <View style={styles.counterBadge}>
              <Ionicons name="camera-outline" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.counterBadgeText}>
                {activeImageIndex + 1} / {galleryImages.length}
              </Text>
            </View>
          )}
        </View>

        {/* Miniaturas de la Galería (si hay más de 1 foto) */}
        {galleryImages.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailsContainer}
          >
            {galleryImages.map((uri, index) => {
              const isSelected = index === activeImageIndex;
              return (
                <Pressable
                  key={`thumb-${index}`}
                  style={[styles.thumbnailWrapper, isSelected && styles.thumbnailWrapperActive]}
                  onPress={() => handleSelectThumbnail(index)}
                >
                  <Image
                    source={{ uri }}
                    style={styles.thumbnailImage}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* 2. Cuerpo de Detalles Principales */}
        <View style={styles.detailsBody}>
          {product.sku && (
            <Text style={styles.skuText}>
              {isTruck
                ? `${isSpanish ? 'CÓDIGO UNIDAD' : 'UNIT CODE'}: ${product.sku}`
                : `${isSpanish ? 'CÓDIGO OEM / SKU' : 'OEM CODE / SKU'}: ${product.sku}`}
            </Text>
          )}
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Fila de Precio & Ubicación */}
          <View style={styles.priceRow}>
            <View>
              <View style={styles.priceMainRow}>
                <Text style={styles.priceAmount}>
                  {priceInfo.formatted}
                </Text>
                {priceInfo.isFallback && (
                  <View style={styles.fallbackPill}>
                    <Text style={styles.fallbackPillText}>USD</Text>
                  </View>
                )}
              </View>

              {currency === 'CRC' && priceInfo.hasCRC && (
                <Text style={styles.priceSecondaryRef}>
                  ≈ {formatAmount(priceInfo.usdAmount, 'USD')} USD
                </Text>
              )}
              {currency === 'USD' && priceInfo.hasCRC && (
                <Text style={styles.priceSecondaryRef}>
                  ≈ {formatAmount(priceInfo.crcAmount!, 'CRC')} CRC
                </Text>
              )}

              <Text style={styles.priceSubtext}>
                {isTruck
                  ? isSpanish
                    ? 'Precio Venta / Exportación'
                    : 'Export / Commercial Sale Price'
                  : priceInfo.isFallback
                  ? isSpanish
                    ? 'Precio en USD (sin cotización en colones)'
                    : 'Price in USD (No colones pricing)'
                  : isSpanish
                  ? `Precio Unitario (${priceInfo.currency})`
                  : `Unit Price (${priceInfo.currency})`}
              </Text>
            </View>

            <View style={styles.locationBadge}>
              <Ionicons name="location-sharp" size={14} color="#1E40AF" style={{ marginRight: 4 }} />
              <Text style={styles.locationBadgeText}>{locationDisplay}</Text>
            </View>
          </View>

          {/* 3. Ficha Técnica Oficial del Camión (Exclusivo para Camiones) */}
          {isTruck && vehicleDetails && (
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleCardHeader}>
                <Ionicons name="speedometer-outline" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                <Text style={styles.vehicleCardTitle}>
                  {isSpanish ? 'Ficha Técnica del Vehículo' : 'Vehicle Specifications'}
                </Text>
              </View>

              <View style={styles.specsGrid}>
                {/* Marca */}
                {vehicleDetails.make && (
                  <View style={styles.specTile}>
                    <Text style={styles.specTileLabel}>{isSpanish ? 'MARCA' : 'MAKE'}</Text>
                    <Text style={styles.specTileValue} numberOfLines={1}>
                      {vehicleDetails.make}
                    </Text>
                  </View>
                )}

                {/* Modelo */}
                {vehicleDetails.model && (
                  <View style={styles.specTile}>
                    <Text style={styles.specTileLabel}>{isSpanish ? 'MODELO' : 'MODEL'}</Text>
                    <Text style={styles.specTileValue} numberOfLines={1}>
                      {vehicleDetails.model}
                    </Text>
                  </View>
                )}

                {/* Año */}
                {vehicleDetails.year && (
                  <View style={styles.specTile}>
                    <Text style={styles.specTileLabel}>{isSpanish ? 'AÑO' : 'YEAR'}</Text>
                    <Text style={styles.specTileValue}>{vehicleDetails.year}</Text>
                  </View>
                )}

                {/* Millaje / Kilometraje */}
                {vehicleDetails.mileage && (
                  <View style={styles.specTile}>
                    <Text style={styles.specTileLabel}>
                      {isSpanish ? 'KILOMETRAJE / MILLAJE' : 'MILEAGE / ODOMETER'}
                    </Text>
                    <Text style={styles.specTileValue} numberOfLines={1}>
                      {vehicleDetails.mileage}
                    </Text>
                  </View>
                )}

                {/* Motor */}
                {vehicleDetails.engine && (
                  <View style={[styles.specTile, styles.specTileFull]}>
                    <Text style={styles.specTileLabel}>{isSpanish ? 'MOTOR' : 'ENGINE'}</Text>
                    <Text style={styles.specTileValue}>{vehicleDetails.engine}</Text>
                  </View>
                )}

                {/* Transmisión */}
                {vehicleDetails.transmission && (
                  <View style={[styles.specTile, styles.specTileFull]}>
                    <Text style={styles.specTileLabel}>{isSpanish ? 'TRANSMISIÓN' : 'TRANSMISSION'}</Text>
                    <Text style={styles.specTileValue}>{vehicleDetails.transmission}</Text>
                  </View>
                )}

                {/* VIN / Chasis con botón para ver */}
                {vehicleDetails.vin && (
                  <Pressable
                    style={[styles.specTile, styles.specTileFull, styles.specTileVin]}
                    onPress={() => handleShowVin(vehicleDetails.vin!)}
                  >
                    <View style={styles.vinRow}>
                      <View>
                        <Text style={styles.specTileLabel}>
                          {isSpanish ? 'NÚMERO DE CHASIS (VIN)' : 'CHASSIS NUMBER (VIN)'}
                        </Text>
                        <Text style={styles.vinValueText}>{vehicleDetails.vin}</Text>
                      </View>
                      <View style={styles.vinActionPill}>
                        <Ionicons name="information-circle-outline" size={14} color="#2563EB" />
                        <Text style={styles.vinActionText}>{isSpanish ? 'Ver' : 'View'}</Text>
                      </View>
                    </View>
                  </Pressable>
                )}
              </View>

              {/* Botón WhatsApp de Contact to sales */}
              <Pressable style={styles.truckWhatsAppBtn} onPress={handleWhatsAppTruckInquiry}>
                <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.truckWhatsAppBtnText}>{t('contact_sales')}</Text>
              </Pressable>
            </View>
          )}

          {/* Selector de Cantidad (Si no es camión o para repuestos) */}
          {!isTruck && (
            <View style={styles.qtySection}>
              <View>
                <Text style={styles.qtyLabel}>
                  {isSpanish ? 'Cantidad a cotizar:' : 'Quantity to order:'}
                </Text>
                {maxStock <= 10 && maxStock > 0 && (
                  <Text style={styles.qtyStockSubtext}>
                    {isSpanish
                      ? `Disponibles en inventario: ${maxStock}`
                      : `Available in stock: ${maxStock}`}
                    {currentInCart > 0 && ` (${currentInCart} en carrito)`}
                  </Text>
                )}
              </View>
              <View style={styles.qtyControls}>
                <Pressable
                  style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Ionicons name="remove" size={18} color="#0F172A" />
                </Pressable>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <Pressable
                  style={[
                    styles.qtyBtn,
                    (quantity >= maxStock || quantity + currentInCart >= maxStock) &&
                      styles.qtyBtnDisabled,
                  ]}
                  onPress={() => {
                    if (quantity >= maxStock || quantity + currentInCart >= maxStock) {
                      Alert.alert(
                        isSpanish ? 'Límite de Existencias' : 'Stock Limit',
                        isSpanish
                          ? `Solo hay ${maxStock} unidad(es) disponible(s) en inventario.`
                          : `Only ${maxStock} unit(s) available in inventory.`
                      );
                      return;
                    }
                    setQuantity((q) => q + 1);
                  }}
                  disabled={quantity >= maxStock || quantity + currentInCart >= maxStock}
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color={
                      quantity >= maxStock || quantity + currentInCart >= maxStock
                        ? '#94A3B8'
                        : '#0F172A'
                    }
                  />
                </Pressable>
              </View>
            </View>
          )}

          {/* Aviso para camiones (Unidad única) */}
          {isTruck && (
            <View style={styles.truckSingleNotice}>
              <Ionicons name="information-circle" size={16} color="#1D4ED8" style={{ marginRight: 6 }} />
              <Text style={styles.truckSingleNoticeText}>
                {isSpanish
                  ? 'Vehículo único disponible en patio. Cotización por 1 unidad.'
                  : 'Single vehicle available on yard. Quote for 1 unit.'}
              </Text>
            </View>
          )}

          {/* Descripción Técnica / Detalles */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionHeading}>
              {isTruck
                ? isSpanish
                  ? 'Resumen del Vehículo'
                  : 'Vehicle Overview'
                : isSpanish
                ? 'Descripción Técnica'
                : 'Technical Description'}
            </Text>
            <Text style={styles.descriptionText}>
              {product.description ||
                (isTruck
                  ? isSpanish
                    ? 'Vehículo comercial pesado certificado para transporte y flotas. Distribuido por CJ Trucks Parts.'
                    : 'Heavy-duty commercial vehicle certified for transport and commercial fleets. Distributed by CJ Trucks Parts.'
                  : isSpanish
                  ? 'Componente de camión pesado certificado. Inspeccionado por CJ Trucks Parts.'
                  : 'Certified heavy-duty truck component. Inspected by CJ Trucks Parts.')}
            </Text>
          </View>

          {/* Especificaciones adicionales */}
          {product.features && product.features.length > 0 && (
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeading}>{t('specifications')}</Text>
              {product.features.map((feature, idx) => (
                <View key={idx} style={styles.featureItemRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#DC2626" style={styles.featureCheckIcon} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer Fijo con doble botón (Añadir al Carrito + Pedir Ahora) */}
      <View style={styles.stickyFooter}>
        <Pressable
          style={({ pressed }) => [styles.addToCartBtn, pressed && styles.addToCartBtnPressed]}
          onPress={handleAddToCart}
        >
          <Ionicons
            name={addedNotice ? 'checkmark' : 'cart-outline'}
            size={18}
            color="#1E293B"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.addToCartText}>
            {addedNotice
              ? isSpanish
                ? '¡Agregado!'
                : 'Added'
              : isSpanish
              ? 'Agregar al Carrito'
              : 'Add to Cart'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.buyNowBtn, pressed && styles.buyNowBtnPressed]}
          onPress={handleBuyNow}
        >
          <Ionicons name="flash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.buyNowText}>
            {isTruck
              ? isSpanish
                ? 'Enviar Solicitud'
                : 'Submit Request'
              : isSpanish
              ? 'Pedir Ahora'
              : 'Order Now'}
          </Text>
        </Pressable>
      </View>

      {/* Modal de Pantalla Completa para Inspección de Fotos */}
      <Modal
        visible={isModalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={[
            styles.modalSafeArea,
            {
              paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 48 : 24),
              paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 34 : 16),
            },
          ]}
        >
          <StatusBar barStyle="light-content" />
          <View style={styles.modalHeader}>
            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setIsModalVisible(false)}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              accessibilityRole="button"
              accessibilityLabel={isSpanish ? 'Cerrar' : 'Close'}
            >
              <Ionicons name="close" size={26} color="#FFFFFF" />
            </Pressable>
            <View style={styles.modalCounterBadge}>
              <Text style={styles.modalTitle}>
                {modalImageIndex + 1} / {galleryImages.length}
              </Text>
            </View>
            <Pressable
              style={styles.modalClosePill}
              onPress={() => setIsModalVisible(false)}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityRole="button"
              accessibilityLabel={isSpanish ? 'Cerrar' : 'Close'}
            >
              <Text style={styles.modalClosePillText}>
                {isSpanish ? 'Cerrar' : 'Close'}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: modalImageIndex * SCREEN_WIDTH, y: 0 }}
            onMomentumScrollEnd={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setModalImageIndex(slide);
            }}
            style={styles.modalScroll}
          >
            {galleryImages.map((uri, index) => (
              <Pressable
                key={`fullscreen-${index}`}
                style={styles.modalSlide}
                onPress={() => setIsModalVisible(false)}
              >
                <Image
                  source={{ uri }}
                  style={styles.modalImage}
                  contentFit="contain"
                  cachePolicy="memory-disk"
                />
              </Pressable>
            ))}
          </ScrollView>

          {/* Botón flotante inferior para cerrar fácil con el pulgar */}
          <View style={styles.modalBottomBar}>
            <Pressable
              style={styles.modalBottomCloseBtn}
              onPress={() => setIsModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalBottomCloseText}>
                {isSpanish ? 'Toca para cerrar' : 'Tap to close'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topNav: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageCarouselContainer: {
    width: SCREEN_WIDTH,
    height: 280,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  carouselScroll: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  carouselSlide: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  stockTag: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockTagIn: {
    backgroundColor: 'rgba(240, 253, 244, 0.95)',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  stockTagOut: {
    backgroundColor: 'rgba(254, 242, 242, 0.95)',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  stockTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  stockTagTextIn: {
    color: '#166534',
  },
  stockTagTextOut: {
    color: '#991B1B',
  },
  truckTypeBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  truckTypeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  counterBadge: {
    position: 'absolute',
    bottom: 12,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  thumbnailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  thumbnailWrapper: {
    width: 60,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailWrapperActive: {
    borderColor: '#2563EB',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  detailsBody: {
    padding: 20,
  },
  skuText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  priceMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },
  fallbackPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  fallbackPillText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
  },
  priceSecondaryRef: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  priceSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  locationBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  vehicleCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 20,
  },
  vehicleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  vehicleCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0C4A6E',
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  specTileFull: {
    width: '100%',
  },
  specTileVin: {
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  specTileLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  specTileValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  vinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vinValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  vinActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vinActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  truckWhatsAppBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 12,
  },
  truckWhatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  qtySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    marginBottom: 20,
  },
  qtyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  qtyStockSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  truckSingleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  truckSingleNoticeText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
    flex: 1,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    minWidth: 24,
    textAlign: 'center',
  },
  cardSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  featureCheckIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  featureText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  logisticsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  logisticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  logisticsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  logisticsDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  stickyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addToCartBtnPressed: {
    backgroundColor: '#E2E8F0',
  },
  addToCartText: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '700',
  },
  buyNowBtn: {
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buyNowBtnPressed: {
    backgroundColor: '#334155',
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  modalCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCounterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalClosePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClosePillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalScroll: {
    flex: 1,
  },
  modalSlide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  modalBottomBar: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBottomCloseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  modalBottomCloseText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
