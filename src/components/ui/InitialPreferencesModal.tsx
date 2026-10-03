import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';

const INITIAL_SETUP_STORAGE_KEY = 'mills_initial_preferences_configured';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const InitialPreferencesModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { language, setLanguage, isSpanish } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        const configured = await SecureStore.getItemAsync(INITIAL_SETUP_STORAGE_KEY);
        if (!configured) {
          // Primera vez que se abre la app
          setVisible(true);
        }
      } catch (err) {
        console.warn('Error al verificar configuración inicial:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    checkInitialSetup();
  }, []);

  const handleConfirm = async () => {
    try {
      await SecureStore.setItemAsync(INITIAL_SETUP_STORAGE_KEY, 'true');
    } catch (err) {
      console.warn('Error al guardar flag de configuración inicial:', err);
    }
    setVisible(false);
  };

  if (!isLoaded || !visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.card}>
            {/* Logo de la empresa */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Título de Bienvenida */}
            <Text style={styles.title}>
              {isSpanish ? '¡Bienvenido!' : 'Welcome!'}
            </Text>
            <Text style={styles.subtitle}>
              {isSpanish
                ? 'Elige tu idioma y moneda de preferencia para personalizar tu experiencia.'
                : 'Choose your preferred language and currency to customize your experience.'}
            </Text>

            {/* Sección 1: Selección de Idioma (Sin banderas) */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="globe-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>
                  {isSpanish ? 'Idioma / Language' : 'Language / Idioma'}
                </Text>
              </View>

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    language === 'en' && styles.optionBtnActive,
                  ]}
                  onPress={() => setLanguage('en')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.codeBadge, language === 'en' && styles.codeBadgeActive]}>
                    EN
                  </Text>
                  <Text style={[styles.optionText, language === 'en' && styles.optionTextActive]}>
                    English
                  </Text>
                  {language === 'en' && (
                    <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    language === 'es' && styles.optionBtnActive,
                  ]}
                  onPress={() => setLanguage('es')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.codeBadge, language === 'es' && styles.codeBadgeActive]}>
                    ES
                  </Text>
                  <Text style={[styles.optionText, language === 'es' && styles.optionTextActive]}>
                    Español
                  </Text>
                  {language === 'es' && (
                    <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sección 2: Selección de Moneda */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="cash-outline" size={16} color="#16A34A" style={{ marginRight: 6 }} />
                <Text style={styles.sectionTitle}>
                  {isSpanish ? 'Moneda de Precios' : 'Display Currency'}
                </Text>
              </View>

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    currency === 'USD' && styles.optionBtnActive,
                  ]}
                  onPress={() => setCurrency('USD')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.symbolBadge}>$</Text>
                  <Text style={[styles.optionText, currency === 'USD' && styles.optionTextActive]}>
                    USD ($)
                  </Text>
                  {currency === 'USD' && (
                    <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.optionBtn,
                    currency === 'CRC' && styles.optionBtnActive,
                  ]}
                  onPress={() => setCurrency('CRC')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.symbolBadge}>₡</Text>
                  <Text style={[styles.optionText, currency === 'CRC' && styles.optionTextActive]}>
                    CRC (₡)
                  </Text>
                  {currency === 'CRC' && (
                    <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Nota Informativa */}
            <Text style={styles.helpText}>
              {isSpanish
                ? 'Puedes cambiar estas preferencias en cualquier momento en la pestaña Info.'
                : 'You can change these preferences at any time in the Info tab.'}
            </Text>

            {/* Botón de Confirmación Principal */}
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>
                {isSpanish ? 'Comenzar' : 'Get Started'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  safeArea: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  logo: {
    width: 220,
    height: 48,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  codeBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    marginRight: 6,
    overflow: 'hidden',
  },
  codeBadgeActive: {
    color: '#1D4ED8',
    backgroundColor: '#DBEAFE',
  },
  symbolBadge: {
    fontSize: 14,
    fontWeight: '900',
    color: '#16A34A',
    marginRight: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  optionTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 4,
  },
  helpText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 15,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default InitialPreferencesModal;
