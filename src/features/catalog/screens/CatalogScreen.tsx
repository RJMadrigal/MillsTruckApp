import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  StatusBar,
  Linking,
  ActivityIndicator,
  Alert,
  Animated,
  Image as RNImage,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from '../../../navigation/types';
import { useProducts, useCategories } from '../hooks/useProducts';
import { CompactProductCard } from '../../../components/ui/CompactProductCard';
import { Product, Category } from '../types/catalog.types';
import { useCart } from '../../cart/context/CartContext';
import { useActivity } from '../context/ActivityContext';
import { useLanguage } from '../../../i18n/LanguageContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CatalogRouteProp = RouteProp<MainTabParamList, 'CatalogTab'>;

// Shimmering Skeleton Components para carga suave y elegante
const SkeletonCard: React.FC<{ width?: number | string }> = ({ width = 160 }) => {
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={[styles.skeletonCard, { width: width as any }]}>
      <Animated.View style={[styles.skeletonImage, { opacity: pulseAnim }]} />
      <View style={styles.skeletonBody}>
        <Animated.View style={[styles.skeletonLineShort, { opacity: pulseAnim }]} />
        <Animated.View style={[styles.skeletonLineLong, { opacity: pulseAnim }]} />
        <View style={styles.skeletonFooter}>
          <Animated.View style={[styles.skeletonPrice, { opacity: pulseAnim }]} />
          <Animated.View style={[styles.skeletonBtn, { opacity: pulseAnim }]} />
        </View>
      </View>
    </View>
  );
};

const SkeletonPills: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryChipsScroll}
    >
      {[60, 95, 80, 110, 85].map((w, i) => (
        <Animated.View
          key={i}
          style={[styles.skeletonPill, { width: w, opacity: pulseAnim }]}
        />
      ))}
    </ScrollView>
  );
};

export const CatalogScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CatalogRouteProp>();
  const { totalItems } = useCart();
  const { recentlyVisited, mostVisited, recordProductVisit } = useActivity();
  const { t, isSpanish, translateCategory } = useLanguage();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [searchInput, setSearchInput] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'recommended' | 'recent' | 'most_visited'>(
    'recommended'
  );

  // Sincronizar categoría seleccionada si viene desde la pestaña de Categorías
  React.useEffect(() => {
    if (route.params?.selectedCategoryId !== undefined) {
      setSelectedCategoryId(route.params.selectedCategoryId);
    }
  }, [route.params?.selectedCategoryId]);

  const { data: categories = [] } = useCategories();
  const { data: paginatedData, isLoading, isRefetching, refetch } = useProducts({
    categoryId: selectedCategoryId > 0 ? selectedCategoryId : undefined,
    search: searchInput,
    page: 1,
    pageSize: 40,
  });

  const selectedCategory = categories.find((c: Category) => c.categoryId === selectedCategoryId);
  const products = paginatedData?.items || [];

  // Categorías con iconos nativos como en la app de referencia
  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('camion') || n.includes('truck')) return 'truck';
    if (n.includes('motor') || n.includes('engine')) return 'engine-outline';
    if (n.includes('transmi') || n.includes('gear')) return 'cog-outline';
    if (n.includes('freno') || n.includes('brake')) return 'car-brake-alert';
    if (n.includes('difer') || n.includes('eje') || n.includes('axle')) return 'car-traction-control';
    if (n.includes('filtro')) return 'oil';
    return 'truck-outline';
  };

  // Filtrado o segmentación para las secciones
  const primaryProducts = products.slice(0, 10);
  const recommendedProducts = products.length > 5 ? products.slice(5) : products;

  // Lista según pestaña de Your Activity
  const displayedActivityProducts =
    activeSubTab === 'recent'
      ? recentlyVisited
      : activeSubTab === 'most_visited'
      ? mostVisited
      : recommendedProducts;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header Oficial: Logo Central Prominente */}
      <View style={styles.header}>
        <RNImage
          source={require('../../../../assets/logo.png')}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="CJ Trucks Parts"
        />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Barra de Búsqueda Limpia y Redondeada (Search) */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('search_placeholder')}
              placeholderTextColor="#94A3B8"
              value={searchInput}
              onChangeText={setSearchInput}
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
          </View>
        </View>

        {/* 3. Botones de Acción Rápida Duales: Heavy Duty Parts / Commercial Trucks */}
        <View style={styles.quickActionsRow}>
          <Pressable
            style={({ pressed }) => [styles.quickActionPill, pressed && styles.pillPressed]}
            onPress={() => setSelectedCategoryId(0)}
          >
            <View style={[styles.pillIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="cube-outline" size={18} color="#2563EB" />
            </View>
            <View style={styles.pillTextCol}>
              <Text style={styles.pillTitle}>
                {isSpanish ? 'Repuestos en Bodega' : 'Heavy Duty Parts'}
              </Text>
              <Text style={styles.pillSubtitle}>
                {isSpanish ? 'Motores, frenos y más' : 'Engines, brakes & more'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.quickActionPill, pressed && styles.pillPressed]}
            onPress={() => {
              const truckCat = categories.find(
                (c: Category) =>
                  c.name.toLowerCase().includes('camion') ||
                  c.name.toLowerCase().includes('truck')
              );
              if (truckCat) {
                setSelectedCategoryId(truckCat.categoryId);
              }
            }}
          >
            <View style={[styles.pillIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="bus-outline" size={18} color="#DC2626" />
            </View>
            <View style={styles.pillTextCol}>
              <Text style={styles.pillTitle}>
                {isSpanish ? 'Camiones Comerciales' : 'Commercial Trucks'}
              </Text>
              <Text style={styles.pillSubtitle}>
                {isSpanish ? 'Unidades en venta' : 'Trucks for sale'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* 4. Sección "Parts & Trucks" con Categorías Horizontales con Mini-Iconos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('section_parts_trucks')}</Text>
        </View>

        {/* Chips de Categorías con Iconos */}
        {categories.length === 0 && isLoading ? (
          <SkeletonPills />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsScroll}
          >
            {/* Chip "All" */}
            <Pressable
              style={[styles.categoryPill, selectedCategoryId === 0 && styles.categoryPillActive]}
              onPress={() => setSelectedCategoryId(0)}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategoryId === 0 && styles.categoryPillTextActive,
                ]}
              >
                {t('all')}
              </Text>
            </Pressable>

            {/* Categorías con mini-iconos y traducción dinámica */}
            {categories.map((cat: Category) => {
              const isSelected = selectedCategoryId === cat.categoryId;
              const iconName = getCategoryIcon(cat.name);

              return (
                <Pressable
                  key={cat.categoryId}
                  style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                  onPress={() => setSelectedCategoryId(cat.categoryId)}
                >
                  <MaterialCommunityIcons
                    name={iconName as any}
                    size={16}
                    color={isSelected ? '#FFFFFF' : '#DC2626'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}
                  >
                    {translateCategory(cat.name)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Banner de Filtro Activo por Categoría */}
        {selectedCategoryId > 0 && (
          <View style={styles.activeFilterBanner}>
            <View style={styles.activeFilterLeft}>
              <Ionicons name="funnel" size={13} color="#DC2626" />
              <Text style={styles.activeFilterText}>
                {isSpanish ? 'Categoría' : 'Category'}:{' '}
                <Text style={styles.activeFilterName}>
                  {selectedCategory ? translateCategory(selectedCategory.name) : 'Selected'}
                </Text>
              </Text>
            </View>
            <Pressable
              style={styles.clearFilterBtn}
              onPress={() => setSelectedCategoryId(0)}
              hitSlop={8}
            >
              <Text style={styles.clearFilterBtnText}>{t('show_all')}</Text>
              <Ionicons name="close-circle" size={15} color="#DC2626" />
            </Pressable>
          </View>
        )}

        {/* Listado de Repuestos en Carrusel Horizontal con Shimmer */}
        {isLoading ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsHorizontalScroll}
          >
            {[1, 2, 3].map((k) => (
              <View key={`skel-h-${k}`} style={styles.carouselItemWrapper}>
                <SkeletonCard width={160} />
              </View>
            ))}
          </ScrollView>
        ) : primaryProducts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cube-outline" size={42} color="#CBD5E1" />
            <Text style={styles.emptyCardText}>
              {selectedCategoryId > 0
                ? `${isSpanish ? 'No hay repuestos en' : 'No products found in'} "${selectedCategory ? translateCategory(selectedCategory.name) : (isSpanish ? 'esta categoría' : 'this category')}"`
                : t('no_products_found')}
            </Text>
            {selectedCategoryId > 0 && (
              <Pressable
                style={styles.resetCategoryFilterBtn}
                onPress={() => setSelectedCategoryId(0)}
              >
                <Text style={styles.resetCategoryFilterBtnText}>{t('view_all_products')}</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsHorizontalScroll}
          >
            {primaryProducts.map((item: Product) => (
              <View key={item.productId} style={styles.carouselItemWrapper}>
                <CompactProductCard
                  product={item}
                  width={160}
                  onPress={() => {
                    recordProductVisit(item);
                    navigation.navigate('ProductDetail', { product: item });
                  }}
                />
              </View>
            ))}
          </ScrollView>
        )}

        {/* 5. Sección 2: "Your Activity" */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('section_your_activity')}</Text>
          </View>

          {/* Pestañas Horizontales con márgenes simétricos */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subTabsScroll}
          >
            <Pressable
              style={styles.subTabItem}
              onPress={() => setActiveSubTab('recommended')}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSubTab === 'recommended' && styles.subTabTextActive,
                ]}
              >
                {t('tab_recommended')}
              </Text>
              {activeSubTab === 'recommended' && <View style={styles.subTabIndicator} />}
            </Pressable>

            <Pressable
              style={styles.subTabItem}
              onPress={() => setActiveSubTab('recent')}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSubTab === 'recent' && styles.subTabTextActive,
                ]}
              >
                {t('tab_recently_visited')}
              </Text>
              {activeSubTab === 'recent' && <View style={styles.subTabIndicator} />}
            </Pressable>

            <Pressable
              style={styles.subTabItem}
              onPress={() => setActiveSubTab('most_visited')}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSubTab === 'most_visited' && styles.subTabTextActive,
                ]}
              >
                {t('tab_most_visited')}
              </Text>
              {activeSubTab === 'most_visited' && <View style={styles.subTabIndicator} />}
            </Pressable>
          </ScrollView>

          {/* Carrusel de Your Activity */}
          {displayedActivityProducts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsHorizontalScroll}
            >
              {displayedActivityProducts.map((item: Product) => (
                <View key={`act-${activeSubTab}-${item.productId}`} style={styles.carouselItemWrapper}>
                  <CompactProductCard
                    product={item}
                    width={160}
                    onPress={() => {
                      recordProductVisit(item);
                      navigation.navigate('ProductDetail', { product: item });
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons
                name={
                  activeSubTab === 'recent'
                    ? 'time-outline'
                    : activeSubTab === 'most_visited'
                    ? 'trending-up-outline'
                    : 'sparkles-outline'
                }
                size={36}
                color="#94A3B8"
              />
              <Text style={styles.emptyCardText}>
                {activeSubTab === 'recent'
                  ? t('no_recent_items')
                  : activeSubTab === 'most_visited'
                  ? t('no_most_visited')
                  : isSpanish
                  ? 'Explora el catálogo para ver recomendaciones'
                  : 'Explore the catalog to see recommendations'}
              </Text>
            </View>
          )}
        </View>

        {/* 6. Cuadrícula de Todo el Inventario */}
        <View style={styles.allInventorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('section_all_inventory')}</Text>
            <Text style={styles.sectionBadge}>
              {products.length} {isSpanish ? 'repuestos' : 'items'}
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.gridContainer}>
              {[1, 2, 3, 4].map((k) => (
                <View key={`skel-grid-${k}`} style={styles.gridItemWrapper}>
                  <SkeletonCard width="100%" />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {products.map((item: Product) => (
                <View key={`all-${item.productId}`} style={styles.gridItemWrapper}>
                  <CompactProductCard
                    product={item}
                    width="100%"
                    onPress={() => {
                      recordProductVisit(item);
                      navigation.navigate('ProductDetail', { product: item });
                    }}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandLogo: {
    width: '100%',
    maxWidth: 280,
    height: 52,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  quickActionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  pillPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#F8FAFC',
  },
  pillIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pillTextCol: {
    flex: 1,
  },
  pillTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  pillSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryChipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 14,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#2563EB', // Azul como en la app de la derecha
    borderColor: '#2563EB',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },
  cardsHorizontalScroll: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  carouselItemWrapper: {
    width: 160,
  },
  inlineLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  inlineLoadingText: {
    fontSize: 13,
    color: '#64748B',
  },
  activeFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  activeFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#64748B',
  },
  activeFilterName: {
    fontWeight: '800',
    color: '#0F172A',
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  clearFilterBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  resetCategoryFilterBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#DC2626',
    borderRadius: 8,
  },
  resetCategoryFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    marginHorizontal: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyCardText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 6,
  },
  activitySection: {
    marginTop: 22,
  },
  subTabsScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 14,
  },
  subTabItem: {
    paddingVertical: 8,
    position: 'relative',
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  subTabTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  subTabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  allInventorySection: {
    marginTop: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  gridItemWrapper: {
    width: '48%',
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: 8,
  },
  skeletonImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  skeletonBody: {
    padding: 10,
  },
  skeletonLineShort: {
    height: 10,
    width: '50%',
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonLineLong: {
    height: 12,
    width: '85%',
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 10,
  },
  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  skeletonPrice: {
    height: 14,
    width: 60,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  skeletonBtn: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  skeletonPill: {
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
});
