import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../i18n/LanguageContext';

interface CurrencyToggleProps {
  variant?: 'pill' | 'card';
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ variant = 'pill' }) => {
  const { currency, setCurrency, toggleCurrency, isCRC } = useCurrency();
  const { isSpanish } = useLanguage();

  if (variant === 'card') {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconBox}>
            <Ionicons name="cash-outline" size={20} color="#16A34A" />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={styles.cardTitle}>
              {isSpanish ? 'Moneda de Precios' : 'Display Currency'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {isSpanish ? 'Dólares ($ USD) o Colones (₡ CRC)' : 'US Dollars ($ USD) or Colones (₡ CRC)'}
            </Text>
          </View>
        </View>

        <View style={styles.cardButtonsRow}>
          <TouchableOpacity
            style={[
              styles.cardOptionBtn,
              currency === 'USD' && styles.cardOptionBtnActive,
            ]}
            onPress={() => setCurrency('USD')}
            activeOpacity={0.7}
          >
            <Text style={styles.cardSymbol}>$</Text>
            <Text
              style={[
                styles.cardOptionText,
                currency === 'USD' && styles.cardOptionTextActive,
              ]}
            >
              USD ($)
            </Text>
            {currency === 'USD' && (
              <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={styles.checkIcon} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cardOptionBtn,
              currency === 'CRC' && styles.cardOptionBtnActive,
            ]}
            onPress={() => setCurrency('CRC')}
            activeOpacity={0.7}
          >
            <Text style={styles.cardSymbol}>₡</Text>
            <Text
              style={[
                styles.cardOptionText,
                currency === 'CRC' && styles.cardOptionTextActive,
              ]}
            >
              CRC (₡)
            </Text>
            {currency === 'CRC' && (
              <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={styles.checkIcon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Header compact pill button: [ $ USD | ₡ CRC ]
  return (
    <TouchableOpacity
      style={styles.pillContainer}
      onPress={toggleCurrency}
      activeOpacity={0.8}
    >
      <View style={[styles.pillBadge, currency === 'USD' && styles.pillBadgeActive]}>
        <Text style={[styles.pillText, currency === 'USD' && styles.pillTextActive]}>
          $ USD
        </Text>
      </View>
      <View style={[styles.pillBadge, currency === 'CRC' && styles.pillBadgeActive]}>
        <Text style={[styles.pillText, currency === 'CRC' && styles.pillTextActive]}>
          ₡ CRC
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
    color: '#16A34A', // Verde monetario
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
    backgroundColor: '#DCFCE7',
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
    backgroundColor: '#F0FDF4',
    borderColor: '#16A34A',
  },
  cardSymbol: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 6,
    color: '#16A34A',
  },
  cardOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  cardOptionTextActive: {
    color: '#15803D',
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 4,
  },
});

export default CurrencyToggle;
