import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCategories } from '../hooks/useProducts';
import { Category } from '../types/catalog.types';
import { useLanguage } from '../../../i18n/LanguageContext';

// Quick department filter chips
const DEPARTMENT_TAGS = [
  { id: 'all', label: 'All', labelEs: 'Todo' },
  { id: 'truck', label: 'Trucks', labelEs: 'Camiones', keywords: ['camion', 'truck', 'cabezal'] },
  { id: 'engine', label: 'Engines & Turbos', labelEs: 'Motores y Turbos', keywords: ['motor', 'engine', 'turbo', 'diesel'] },
  { id: 'transmi', label: 'Transmissions', labelEs: 'Transmisiones', keywords: ['transmi', 'gear', 'embrague', 'clutch'] },
  { id: 'brake', label: 'Brakes', labelEs: 'Frenos', keywords: ['freno', 'brake', 'bendix', 'zapata'] },
  { id: 'suspension', label: 'Suspension & Axles', labelEs: 'Suspensiones y Ejes', keywords: ['suspens', 'eje', 'axle', 'difer'] },
  { id: 'injection', label: 'Fuel & Injection', labelEs: 'Combustible e Inyección', keywords: ['inyec', 'combust', 'bomba'] },
  { id: 'filters', label: 'Filters & Oil', labelEs: 'Filtros y Aceites', keywords: ['filtro', 'oil', 'lubric'] },
  { id: 'electrical', label: 'Electrical', labelEs: 'Eléctrico', keywords: ['electr', 'luz', 'sensor', 'flash'] },
];

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { data: categories = [], isLoading } = useCategories();
  const { t, isSpanish, translateCategory } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('camion') || n.includes('truck')) return 'truck';
    if (n.includes('motor') || n.includes('engine') || n.includes('turbo')) return 'engine-outline';
    if (n.includes('freno') || n.includes('brake')) return 'car-brake-alert';
    if (n.includes('transmi') || n.includes('gear') || n.includes('clutch')) return 'cog-outline';
    if (n.includes('suspens') || n.includes('eje') || n.includes('axle') || n.includes('difer'))
      return 'car-traction-control';
    if (n.includes('filtro') || n.includes('oil')) return 'oil';
    if (n.includes('electr') || n.includes('luz')) return 'flash-outline';
    return 'truck-outline';
  };

  // Filtrado reactivo por texto y por chip de departamento
  const filteredCategories = useMemo(() => {
    return categories.filter((cat: Category) => {
      // 1. Filtro por tag seleccionado
      if (selectedTag !== 'all') {
        const tagDef = DEPARTMENT_TAGS.find((t) => t.id === selectedTag);
        if (tagDef && tagDef.keywords) {
          const catNameLower = cat.name.toLowerCase();
          const catDescLower = (cat.description || '').toLowerCase();
          const matchesTag = tagDef.keywords.some(
            (kw) => catNameLower.includes(kw) || catDescLower.includes(kw)
          );
          if (!matchesTag) return false;
        }
      }

      // 2. Filtro por texto de búsqueda
      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(q);
        const matchesDesc = cat.description ? cat.description.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [categories, selectedTag, searchQuery]);

  const handleSelectCategory = (cat: Category) => {
    navigation.navigate('CatalogTab', { selectedCategoryId: cat.categoryId });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTag('all');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>
          {isSpanish ? 'BUSCAR POR DEPARTAMENTO' : 'BROWSE BY DEPARTMENT'}
        </Text>
        <Text style={styles.headerTitle}>{t('nav_categories')}</Text>

        {/* Barra de búsqueda de categorías */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={18} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={
              isSpanish
                ? 'Filtrar departamentos (ej. Motores, Frenos)...'
                : 'Filter categories (e.g. Engine, Brakes)...'
            }
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>

        {/* Chips de filtro rápido horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScroll}
        >
          {DEPARTMENT_TAGS.map((tag) => {
            const isTagActive = selectedTag === tag.id;
            return (
              <Pressable
                key={tag.id}
                style={[styles.tagPill, isTagActive && styles.tagPillActive]}
                onPress={() => setSelectedTag(tag.id)}
              >
                <Text style={[styles.tagPillText, isTagActive && styles.tagPillTextActive]}>
                  {isSpanish ? tag.labelEs : tag.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Sub-header con contador de resultados y botón de reset si hay filtro */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCount}>
          {filteredCategories.length}{' '}
          {filteredCategories.length === 1
            ? isSpanish
              ? 'departamento'
              : 'department'
            : isSpanish
            ? 'departamentos'
            : 'departments'}
          {selectedTag !== 'all' || searchQuery.trim() !== ''
            ? isSpanish
              ? ' encontrados'
              : ' found'
            : isSpanish
            ? ' disponibles'
            : ' available'}
        </Text>
        {(selectedTag !== 'all' || searchQuery.trim() !== '') && (
          <Pressable style={styles.resetLink} onPress={handleResetFilters}>
            <Text style={styles.resetLinkText}>{t('clear_filter')}</Text>
            <Ionicons name="close" size={14} color="#DC2626" />
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      ) : filteredCategories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="search-outline" size={36} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>
            {isSpanish ? 'No se encontraron categorías' : 'No matching categories'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {t('no_categories_match')}
          </Text>
          <Pressable style={styles.resetButton} onPress={handleResetFilters}>
            <Text style={styles.resetButtonText}>{t('view_all_categories')}</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {filteredCategories.map((cat: Category) => (
              <Pressable
                key={cat.categoryId}
                style={({ pressed }) => [styles.categoryCard, pressed && styles.categoryCardPressed]}
                onPress={() => handleSelectCategory(cat)}
              >
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons
                    name={getCategoryIcon(cat.name) as any}
                    size={28}
                    color="#DC2626"
                  />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {translateCategory(cat.name)}
                </Text>
                {cat.description ? (
                  <Text style={styles.categoryDesc} numberOfLines={2}>
                    {cat.description}
                  </Text>
                ) : (
                  <Text style={styles.categoryDesc}>
                    {isSpanish ? 'Inventario disponible' : 'Available inventory'}
                  </Text>
                )}
                <View style={styles.cardFooter}>
                  <Text style={styles.footerLink}>
                    {isSpanish ? 'Explorar repuestos' : 'Explore items'}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  tagScroll: {
    paddingTop: 10,
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagPillActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tagPillTextActive: {
    color: '#FFFFFF',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  resetLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
