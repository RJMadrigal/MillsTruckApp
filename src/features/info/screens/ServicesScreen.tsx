import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const ServicesScreen: React.FC = () => {
  const handleCallUSA = () => {
    Linking.openURL('tel:+18005556455');
  };

  const handleCallCR = () => {
    Linking.openURL('tel:+50670334308');
  };

  const handleWhatsAppDispatch = () => {
    const msg = encodeURIComponent(
      'Hola CJ 506 Towing Service, requiero asistencia de grúa / rescate de camión pesado.'
    );
    Linking.openURL(`https://wa.me/50670334308?text=${msg}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>ASISTENCIA Y RESCATE 24/7</Text>
        <Text style={styles.headerTitle}>Towing & Grúas Pesadas</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Hero */}
        <View style={styles.heroCard}>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>CJ 506 TOWING SERVICE</Text>
          <Text style={styles.heroSubtitle}>
            Servicio de remolque y rescate pesado en Easton, PA (USA) y Costa Rica.
          </Text>

          <Pressable style={styles.emergencyBtn} onPress={handleWhatsAppDispatch}>
            <Ionicons name="flash" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.emergencyBtnText}>Solicitar Grúa Urgente (WhatsApp)</Text>
          </Pressable>
        </View>

        {/* Botones de Llamada Directa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Central Telefónica de Emergencias</Text>
          <View style={styles.phoneGrid}>
            <Pressable style={styles.phoneCard} onPress={handleCallUSA}>
              <Ionicons name="call" size={24} color="#DC2626" style={{ marginBottom: 6 }} />
              <Text style={styles.phoneLocation}>USA - Easton, PA</Text>
              <Text style={styles.phoneNumber}>+1 (800) 555-MILLS</Text>
              <Text style={styles.phoneHours}>Operativo 24/7</Text>
            </Pressable>

            <Pressable style={styles.phoneCard} onPress={handleCallCR}>
              <Ionicons name="call" size={24} color="#2563EB" style={{ marginBottom: 6 }} />
              <Text style={styles.phoneLocation}>Costa Rica - GAM</Text>
              <Text style={styles.phoneNumber}>+506 7033-4308</Text>
              <Text style={styles.phoneHours}>Operativo 24/7</Text>
            </Pressable>
          </View>
        </View>

        {/* Cobertura de Servicios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios Disponibles</Text>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIconBox}>
              <MaterialCommunityIcons name={"tow-truck" as any} size={24} color="#DC2626" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Remolque de Carga Pesada</Text>
              <Text style={styles.serviceDesc}>
                Cabezales, camiones de volteo, plataformas, buses y trailers.
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIconBox}>
              <MaterialCommunityIcons name="crane" size={24} color="#2563EB" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Rescate y Maniobras Complejas</Text>
              <Text style={styles.serviceDesc}>
                Grúas telescópicas y rotativas para accidentes o salidas de vía.
              </Text>
            </View>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIconBox}>
              <Ionicons name="construct-outline" size={24} color="#059669" />
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>Auxilio Mecánico en Carretera</Text>
              <Text style={styles.serviceDesc}>
                Paso de corriente a 24V, cambio de llantas de camión y diagnóstico básico.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  heroLogo: {
    width: 90,
    height: 90,
    borderRadius: 18,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  emergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    width: '100%',
  },
  emergencyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  phoneGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  phoneCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  phoneLocation: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  phoneNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  phoneHours: {
    fontSize: 10,
    color: '#16A34A',
    fontWeight: '700',
    marginTop: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  serviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
});
