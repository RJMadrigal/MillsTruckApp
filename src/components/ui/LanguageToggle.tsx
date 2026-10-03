import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface LanguageToggleProps {
  variant?: 'pill' | 'switch' | 'card';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'pill' }) => {
  const { language, setLanguage, isSpanish, toggleLanguage } = useLanguage();

  if (variant === 'card') {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <Ionicons name="globe-outline" size={20} color="#2563EB" />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>
              {isSpanish ? 'Idioma de la App' : 'App Language'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isSpanish ? 'Español o Inglés' : 'English or Spanish'}
            </Text>
          </View>
        </View>

        <View style={styles.cardButtonsRow}>
          <TouchableOpacity
            style={[
              styles.cardOptionBtn,
              language === 'en' && styles.cardOptionBtnActive,
            ]}
            onPress={() => setLanguage('en')}
            activeOpacity={0.7}
          >
            <Text style={[styles.cardCode, language === 'en' && styles.cardCodeActive]}>
              EN
            </Text>
            <Text
              style={[
                styles.cardOptionText,
                language === 'en' && styles.cardOptionTextActive,
              ]}
            >
              English
            </Text>
            {language === 'en' && (
              <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cardOptionBtn,
              language === 'es' && styles.cardOptionBtnActive,
            ]}
            onPress={() => setLanguage('es')}
            activeOpacity={0.7}
          >
            <Text style={[styles.cardCode, language === 'es' && styles.cardCodeActive]}>
              ES
            </Text>
            <Text
              style={[
                styles.cardOptionText,
                language === 'es' && styles.cardOptionTextActive,
              ]}
            >
              Español
            </Text>
            {language === 'es' && (
              <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Header compact pill button: [ 🇺🇸 EN | 🇨🇷 ES ]
  return (
    <TouchableOpacity
      style={styles.pillContainer}
      onPress={toggleLanguage}
      activeOpacity={0.8}
    >
      <View style={[styles.pillBadge, language === 'en' && styles.pillBadgeActive]}>
        <Text style={[styles.pillText, language === 'en' && styles.pillTextActive]}>
          EN
        </Text>
      </View>
      <View style={[styles.pillBadge, language === 'es' && styles.pillBadgeActive]}>
        <Text style={[styles.pillText, language === 'es' && styles.pillTextActive]}>
          ES
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
  },
  pillBadgeActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  pillTextActive: {
    color: '#0F172A',
  },

  // Card Variant styles
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  cardButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cardOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cardOptionBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  cardCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginRight: 8,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cardCodeActive: {
    color: '#1D4ED8',
    backgroundColor: '#DBEAFE',
  },
  cardOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  cardOptionTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 4,
  },
});

export default LanguageToggle;
