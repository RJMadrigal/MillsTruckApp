import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  StatusBar,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLanguage } from '../../../i18n/LanguageContext';
import { LanguageToggle } from '../../../components/ui/LanguageToggle';
import { CurrencyToggle } from '../../../components/ui/CurrencyToggle';

type LegalModalType = 'privacy' | 'terms' | null;

export const InfoScreen: React.FC = () => {
  const { t, isSpanish } = useLanguage();
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  const handleCallUSA = (num = '9085529433') => {
    Linking.openURL(`tel:+1${num}`);
  };

  const handleCallCR = () => {
    Linking.openURL('tel:+50670334308');
  };

  const handleOpenWhatsApp = () => {
    Linking.openURL(
      'https://wa.me/50670334308?text=Hello%20CJ%20Trucks%20Parts%2C%20I%20have%20an%20inquiry%20regarding%20parts%20or%20trucks.'
    );
  };

  const handleSendEmail = () => {
    Linking.openURL('mailto:centraljerseymills@gmail.com?subject=CJ%20Trucks%20Parts%20Inquiry');
  };

  const handleOpenWebsite = () => {
    Linking.openURL('https://millstruckservices.com');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Corporate Header */}
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>COMPANY DIRECTORY</Text>
        <Text style={styles.headerTitle}>CJ Trucks Parts</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero Brand Card with Extended Logo */}
        <View style={styles.heroCard}>
          <Image
            source={require('../../../../assets/logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.heroSubtitle}>
            {isSpanish
              ? 'Repuestos para Camiones Pesados y Distribución de Flotas'
              : 'Heavy-Duty Truck Parts & Commercial Fleet Distribution'}
          </Text>

          {/* Location Badge */}
          <View style={styles.badgesRow}>
            <View style={styles.locationPill}>
              <Ionicons name="globe-outline" size={13} color="#2563EB" style={{ marginRight: 4 }} />
              <Text style={styles.locationPillText}>Easton, PA (USA) & San José, Costa Rica</Text>
            </View>
          </View>
        </View>

        {/* 2. Language Selector Card (English / Español) */}
        <LanguageToggle variant="card" />

        {/* Currency Selector Card (USD / CRC) */}
        <CurrencyToggle variant="card" />

        {/* 3. Primary Action: Direct WhatsApp Sales CTA */}
        <Pressable style={styles.whatsAppBtn} onPress={handleOpenWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" style={{ marginRight: 10 }} />
          <View style={styles.whatsAppTextCol}>
            <Text style={styles.whatsAppTitle}>{t('contact_sales')}</Text>
            <Text style={styles.whatsAppSub}>
              {isSpanish ? 'Atención directa vía WhatsApp' : 'Direct assistance via WhatsApp'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </Pressable>

        {/* 4. Direct Phone Support Channels */}
        <View style={styles.phoneGrid}>
          <View style={styles.phoneCard}>
            <View style={styles.phoneIconBox}>
              <Ionicons name="call" size={20} color="#DC2626" />
            </View>
            <Text style={styles.phoneLocation}>{t('usa_easton')}</Text>
            <Pressable onPress={() => handleCallUSA('9085529433')} hitSlop={6}>
              <Text style={styles.phoneNumber}>908-552-9433</Text>
            </Pressable>
            <Pressable onPress={() => handleCallUSA('9086665515')} hitSlop={6}>
              <Text style={styles.phoneNumberSecondary}>908-666-5515</Text>
            </Pressable>
            <Text style={styles.phoneDesc}>Easton, Pennsylvania</Text>
          </View>

          <Pressable style={styles.phoneCard} onPress={handleCallCR}>
            <View style={[styles.phoneIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#2563EB" />
            </View>
            <Text style={styles.phoneLocation}>{t('cr_sanjose')}</Text>
            <Text style={styles.phoneNumber}>+506 7033-4308</Text>
            <Text style={styles.phoneDesc}>{isSpanish ? 'WhatsApp y Llamadas' : 'WhatsApp & Calls'}</Text>
          </Pressable>
        </View>

        {/* 5. Official Locations */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-sharp" size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>{t('locations_title')}</Text>
          </View>

          {/* USA Location */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeaderRow}>
              <Text style={styles.locationName}>Easton, Pennsylvania</Text>
              <View style={styles.countryTag}>
                <Text style={styles.countryTagText}>USA</Text>
              </View>
            </View>
            <View style={styles.addressRow}>
              <Ionicons name="navigate-outline" size={13} color="#2563EB" style={{ marginRight: 5 }} />
              <Text style={styles.exactAddressText}>Easton, PA 18042, United States</Text>
            </View>
            <View style={styles.addressRow}>
              <Ionicons name="call-outline" size={13} color="#DC2626" style={{ marginRight: 5 }} />
              <Text style={styles.exactPhoneText}>908-552-9433 / 908-666-5515</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Costa Rica Location */}
          <View style={styles.locationCard}>
            <View style={styles.locationHeaderRow}>
              <Text style={styles.locationName}>San José, Costa Rica</Text>
              <View style={[styles.countryTag, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.countryTagText, { color: '#2563EB' }]}>CR</Text>
              </View>
            </View>
            <View style={styles.addressRow}>
              <Ionicons name="navigate-outline" size={13} color="#2563EB" style={{ marginRight: 5 }} />
              <Text style={styles.exactAddressText}>San José, Costa Rica</Text>
            </View>
          </View>
        </View>

        {/* 6. Required Store Compliance: Privacy Policy & Terms and Conditions */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>{t('store_policies')}</Text>
          </View>
          <Text style={styles.sectionDesc}>
            {isSpanish
              ? 'Documentos legales oficiales para Apple App Store y Google Play Store:'
              : 'Official legal documents required by Apple App Store and Google Play Store:'}
          </Text>

          {/* Privacy Policy */}
          <Pressable style={styles.policyRow} onPress={() => setActiveModal('privacy')}>
            <View style={styles.policyLeft}>
              <View style={[styles.policyIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="lock-closed-outline" size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.policyTitle}>{t('privacy_policy')}</Text>
                <Text style={styles.policySubtitle}>
                  {isSpanish
                    ? 'Protección de datos personales y derechos del usuario'
                    : 'Data protection, guest checkout & privacy rights'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>

          <View style={styles.policyDivider} />

          {/* Terms & Conditions */}
          <Pressable style={styles.policyRow} onPress={() => setActiveModal('terms')}>
            <View style={styles.policyLeft}>
              <View style={[styles.policyIconBox, { backgroundColor: '#F8FAFC' }]}>
                <Ionicons name="document-text-outline" size={18} color="#0F172A" />
              </View>
              <View>
                <Text style={styles.policyTitle}>{t('terms_conditions')}</Text>
                <Text style={styles.policySubtitle}>
                  {isSpanish
                    ? 'Cotizaciones, precios en USD y términos comerciales'
                    : 'Order requests, pricing in USD, and commercial terms'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </Pressable>
        </View>

        {/* 7. Corporate Operations Card */}
        <View style={styles.transparencyCard}>
          <Text style={styles.transparencyTitle}>{t('company_transparency')}</Text>
          <View style={styles.transparencyRow}>
            <Text style={styles.transparencyLabel}>Operating Entity:</Text>
            <Text style={styles.transparencyValue}>CJ Trucks Parts LLC</Text>
          </View>
          <View style={styles.transparencyRow}>
            <Text style={styles.transparencyLabel}>Official Website:</Text>
            <Pressable onPress={handleOpenWebsite}>
              <Text style={styles.transparencyLink}>millstruckservices.com</Text>
            </Pressable>
          </View>
          <View style={styles.transparencyRow}>
            <Text style={styles.transparencyLabel}>USA Hub:</Text>
            <Text style={styles.transparencyValue}>Easton, Pennsylvania, USA</Text>
          </View>
          <View style={styles.transparencyRow}>
            <Text style={styles.transparencyLabel}>Central America Hub:</Text>
            <Text style={styles.transparencyValue}>San José, Costa Rica</Text>
          </View>
          <View style={styles.transparencyRow}>
            <Text style={styles.transparencyLabel}>App Version:</Text>
            <Text style={styles.transparencyValue}>1.0.0 (Official Production)</Text>
          </View>

          <Pressable style={styles.emailBtn} onPress={handleSendEmail}>
            <Ionicons name="mail-outline" size={16} color="#2563EB" style={{ marginRight: 6 }} />
            <Text style={styles.emailBtnText}>centraljerseymills@gmail.com</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.copyrightText}>
            © 2026 CJ Trucks Parts LLC. All rights reserved.
          </Text>
          <Text style={styles.disclaimerText}>
            Manufacturer names (Cummins, Detroit Diesel, Caterpillar, Eaton Fuller, Meritor, Freightliner, Kenworth, Peterbilt, Mack) are registered trademarks of their respective owners and are used strictly for technical identification and compatibility purposes.
          </Text>
        </View>
      </ScrollView>

      {/* 7. Native Modal for Store-Compliant Legal Documents */}
      <Modal
        visible={activeModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>
              {activeModal === 'privacy' && (isSpanish ? 'Política de Privacidad' : 'Privacy Policy')}
              {activeModal === 'terms' && (isSpanish ? 'Términos y Condiciones' : 'Terms and Conditions')}
            </Text>
            <Pressable style={styles.modalCloseBtn} onPress={() => setActiveModal(null)}>
              <Ionicons name="close" size={22} color="#0F172A" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
            {activeModal === 'privacy' && (
              isSpanish ? (
                <View>
                  <Text style={styles.legalDate}>Última actualización: 1 de Octubre, 2026</Text>

                  <Text style={styles.legalSectionTitle}>1. Naturaleza de la Aplicación y Alcance</Text>
                  <Text style={styles.legalParagraph}>
                    La presente Política de Privacidad rige el uso de la aplicación móvil <Text style={styles.bold}>CJ Trucks Parts</Text>, desarrollada y publicada por <Text style={styles.bold}>Josué Madrigal (PuraCode)</Text> en representación oficial y bajo autorización comercial de <Text style={styles.bold}>CJ Trucks Parts LLC / Mills Truck Service</Text> (sitio oficial: <Text style={styles.bold}>millstruckservices.com</Text>).
                  </Text>
                  <Text style={styles.legalParagraph}>
                    Esta aplicación funciona exclusivamente como un <Text style={styles.bold}>catálogo informativo y generador de cotizaciones comerciales (leads de compra)</Text> para repuestos mecánicos pesados y camiones comerciales.
                  </Text>

                  <Text style={styles.legalSectionTitle}>2. Ausencia Total de Pagos en la App (Sin Pasarelas de Pago)</Text>
                  <Text style={styles.legalParagraph}>
                    <Text style={styles.bold}>La aplicación NO procesa pagos, NO cobra tarjetas de crédito o débito, NO solicita información bancaria y NO vende bienes digitales dentro de la app.</Text> La función de "Carrito" y "Continuar con el Pedido" genera una intención de compra o solicitud de cotización que es recibida por nuestro equipo de ventas para su revisión manual. Cualquier pago o transacción comercial se coordina directamente fuera de la aplicación móvil (transferencia bancaria, factura proforma o pago directo en sucursal).
                  </Text>

                  <Text style={styles.legalSectionTitle}>3. Acceso Abierto sin Necesidad de Cuenta</Text>
                  <Text style={styles.legalParagraph}>
                    Cualquier usuario puede navegar libremente por el catálogo de repuestos, consultar especificaciones técnicas, números de parte y precios en Dólares ($ USD) o Colones (₡ CRC) <Text style={styles.bold}>sin necesidad de registrarse, crear contraseñas ni vincular redes sociales</Text>.
                  </Text>

                  <Text style={styles.legalSectionTitle}>4. Datos Recopilados al Enviar una Cotización</Text>
                  <Text style={styles.legalParagraph}>
                    Cuando un usuario decide voluntariamente enviar una cotización a través del carrito, recopilamos únicamente los datos mínimos indispensables para que un asesor de ventas pueda atenderle:
                  </Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Nombre o Empresa:</Text> Para identificar la cotización en nuestro sistema de atención.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Teléfono / WhatsApp (Requerido):</Text> Para que el equipo de ventas le contacte con la disponibilidad exacta, opciones de entrega y cotización final.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Correo Electrónico (Opcional):</Text> Para enviar proformas o fichas técnicas en PDF si el cliente lo prefiere.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Dirección o Ciudad (Opcional):</Text> Para estimar fletes y rutas de despacho.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Notas del Pedido:</Text> Consultas sobre compatibilidad, número de chasis (VIN) o especificaciones especiales provistas por el usuario.</Text>

                  <Text style={styles.legalSectionTitle}>5. Uso y Protección de la Información</Text>
                  <Text style={styles.legalParagraph}>
                    <Text style={styles.bold}>NO vendemos, alquilamos ni comercializamos su información personal a terceros ni a redes de publicidad.</Text> Su información se utiliza estrictamente para:
                  </Text>
                  <Text style={styles.legalBullet}>• Registrar la solicitud de cotización en nuestro sistema ERP de ventas.</Text>
                  <Text style={styles.legalBullet}>• Contactar al cliente vía WhatsApp, llamada telefónica o correo electrónico.</Text>
                  <Text style={styles.legalBullet}>• Todas las comunicaciones con nuestro servidor se transmiten bajo cifrado seguro HTTPS.</Text>

                  <Text style={styles.legalSectionTitle}>6. Almacenamiento Local en el Dispositivo</Text>
                  <Text style={styles.legalParagraph}>
                    La app almacena de forma local y segura en su dispositivo (SecureStore) su carrito de repuestos, historial reciente y su preferencia de moneda (USD/CRC) e idioma (ES/EN). Esta información no se comparte con rastreadores publicitarios externos ni rastrea la actividad del usuario entre otras aplicaciones.
                  </Text>

                  <Text style={styles.legalSectionTitle}>7. Derechos del Usuario y Eliminación de Datos</Text>
                  <Text style={styles.legalParagraph}>
                    Usted puede solicitar en cualquier momento la revisión o eliminación definitiva de sus datos de contacto de nuestros registros comerciales enviando un correo a <Text style={styles.bold}>centraljerseymills@gmail.com</Text> o comunicándose por WhatsApp al <Text style={styles.bold}>+506 7033 4308</Text>. Las solicitudes se atienden en menos de 48 horas hábiles.
                  </Text>

                  <Text style={styles.legalSectionTitle}>8. Contacto y Oficinas Operativas</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Empresa Operadora:</Text> CJ Trucks Parts LLC / Mills Truck Service</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Desarrollador / Publicador:</Text> Josué Madrigal (PuraCode)</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Sitio Web Oficial:</Text> https://millstruckservices.com</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Correo Electrónico:</Text> centraljerseymills@gmail.com</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Sede Costa Rica:</Text> San José, Costa Rica | Tel / WhatsApp: +506 7033 4308</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Sede USA:</Text> Easton, Pennsylvania, USA</Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.legalDate}>Last Updated: October 1, 2026</Text>

                  <Text style={styles.legalSectionTitle}>1. Application Nature & Scope</Text>
                  <Text style={styles.legalParagraph}>
                    This Privacy Policy governs the use of the <Text style={styles.bold}>CJ Trucks Parts</Text> mobile application, developed and published by <Text style={styles.bold}>Josué Madrigal (PuraCode)</Text> on behalf of and under official commercial authorization from <Text style={styles.bold}>CJ Trucks Parts LLC / Mills Truck Service</Text> (official website: <Text style={styles.bold}>millstruckservices.com</Text>).
                  </Text>
                  <Text style={styles.legalParagraph}>
                    This application functions strictly as an <Text style={styles.bold}>informative digital catalog and quotation lead generator</Text> for heavy-duty commercial truck parts and vehicles.
                  </Text>

                  <Text style={styles.legalSectionTitle}>2. No In-App Payments or Financial Transactions</Text>
                  <Text style={styles.legalParagraph}>
                    <Text style={styles.bold}>The application does NOT process payments, does NOT charge credit or debit cards, does NOT collect banking credentials, and does NOT sell digital goods.</Text> Submitting items through the Cart and Checkout features generates a commercial purchase inquiry / quote request (lead) that is reviewed by our sales department. All financial transactions and order agreements are coordinated externally outside the mobile application (e.g. wire transfer, official proforma invoice, or local branch payment).
                  </Text>

                  <Text style={styles.legalSectionTitle}>3. Open Access & No Account Required</Text>
                  <Text style={styles.legalParagraph}>
                    Users may browse our catalog, part specifications, OEM references, and estimated pricing in US Dollars ($ USD) or Costa Rican Colones (₡ CRC) <Text style={styles.bold}>without creating an account, registering passwords, or linking social media accounts</Text>.
                  </Text>

                  <Text style={styles.legalSectionTitle}>4. Information Collected via Quote Submission</Text>
                  <Text style={styles.legalParagraph}>
                    When you voluntarily submit a purchase inquiry or quote request through the guest checkout form, we collect only the necessary contact details needed to serve your request:
                  </Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Contact Name / Company Name:</Text> To identify your quote request in our sales system.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Phone / WhatsApp Number (Required):</Text> Required for our sales team to follow up with part availability, shipping options, and final pricing.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Email Address (Optional):</Text> For transmitting written proforma invoices and technical sheets.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Delivery Address / City (Optional):</Text> To calculate freight or dispatch logistics.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Order Notes:</Text> Optional fitment details, VIN numbers, or customer instructions.</Text>

                  <Text style={styles.legalSectionTitle}>5. Data Protection & No Third-Party Sales</Text>
                  <Text style={styles.legalParagraph}>
                    <Text style={styles.bold}>We do NOT sell, rent, lease, or monetize your personal information to third parties, data brokers, or advertising networks.</Text> Data is used solely to process sales inquiries in our internal ERP system and contact you regarding your requested items. All API transmissions are protected using industry-standard HTTPS encryption.
                  </Text>

                  <Text style={styles.legalSectionTitle}>6. Local Device Storage</Text>
                  <Text style={styles.legalParagraph}>
                    The application uses secure on-device storage (SecureStore) strictly to preserve your cart items, recent browsing history, and language/currency preferences. This data remains on your physical device and does not track you across other applications.
                  </Text>

                  <Text style={styles.legalSectionTitle}>7. User Rights & Data Deletion</Text>
                  <Text style={styles.legalParagraph}>
                    You have the right to request the inspection, correction, or permanent deletion of your contact records at any time by emailing <Text style={styles.bold}>centraljerseymills@gmail.com</Text> or messaging our WhatsApp hotline at <Text style={styles.bold}>+506 7033 4308</Text>. Requests are handled within 48 business hours.
                  </Text>

                  <Text style={styles.legalSectionTitle}>8. Operational Hubs & Contact</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Operating Entity:</Text> CJ Trucks Parts LLC / Mills Truck Service</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Developer / Publisher:</Text> Josué Madrigal (PuraCode)</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Website:</Text> https://millstruckservices.com</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Email:</Text> centraljerseymills@gmail.com</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Costa Rica Hub:</Text> San José, Costa Rica | Tel / WhatsApp: +506 7033 4308</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>USA Hub:</Text> Easton, Pennsylvania, USA</Text>
                </View>
              )
            )}

            {activeModal === 'terms' && (
              isSpanish ? (
                <View>
                  <Text style={styles.legalDate}>Última actualización: 1 de Octubre, 2026</Text>

                  <Text style={styles.legalSectionTitle}>1. Aceptación de los Términos</Text>
                  <Text style={styles.legalParagraph}>
                    Al descargar, acceder o utilizar la aplicación móvil <Text style={styles.bold}>CJ Trucks Parts</Text>, usted acepta cumplir los presentes Términos y Condiciones. Si no está de acuerdo, le solicitamos no utilizar la aplicación.
                  </Text>

                  <Text style={styles.legalSectionTitle}>2. Finalidad de la Aplicación y Cotizaciones (Leads)</Text>
                  <Text style={styles.legalParagraph}>
                    Esta aplicación funciona exclusivamente como un catálogo digital interactivo de repuestos mecánicos pesados y camiones comerciales de <Text style={styles.bold}>CJ Trucks Parts LLC</Text> (plataforma web: <Text style={styles.bold}>millstruckservices.com</Text>).
                  </Text>
                  <Text style={styles.legalParagraph}>
                    <Text style={styles.bold}>El envío de un pedido o cotización a través de la aplicación NO constituye una transacción financiera inmediata ni un cargo a tarjeta de crédito.</Text> Constituye una solicitud comercial o intención de compra (lead) que es enviada a nuestro equipo de ventas para verificar existencias, calcular fletes de entrega y contactar al cliente para formalizar la venta fuera de la app.
                  </Text>

                  <Text style={styles.legalSectionTitle}>3. Precios y Monedas de Referencia</Text>
                  <Text style={styles.legalParagraph}>
                    Los precios en el catálogo se presentan para fines informativos y de referencia en <Text style={styles.bold}>Dólares Estadounidenses ($ USD)</Text> y opcionalmente en <Text style={styles.bold}>Colones Costarricenses (₡ CRC)</Text>. Los precios finales de facturación, impuestos aplicables y costos de flete serán confirmados por escrito por nuestro asesor de ventas antes de formalizar cualquier pago.
                  </Text>

                  <Text style={styles.legalSectionTitle}>4. Contacto por Parte del Equipo de Ventas</Text>
                  <Text style={styles.legalParagraph}>
                    Al ingresar su nombre y número telefónico/WhatsApp en el formulario de cotización, usted autoriza a nuestros ejecutivos de ventas a contactarle vía WhatsApp, llamada o correo electrónico con el único fin de confirmar disponibilidad de repuestos, brindar asesoría técnica y coordinar el despacho.
                  </Text>

                  <Text style={styles.legalSectionTitle}>5. Garantía Comercial e Inspección</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Componentes Mecánicos Mayores:</Text> Motores diésel, transmisiones y diferenciales cuentan con garantía limitada de 30 a 90 días contra defectos mecánicos internos a partir de la entrega.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Exclusiones:</Text> La garantía no cubre daños por instalación incorrecta, falta de lubricación adecuada, sobrecalentamiento, accidentes o manipulación no autorizada.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Devoluciones:</Text> Solicitudes de devolución por incompatibilidad deben notificarse dentro de los 7 días hábiles posteriores a la entrega, en su estado original sin instalar.</Text>

                  <Text style={styles.legalSectionTitle}>6. Logística y Despacho</Text>
                  <Text style={styles.legalParagraph}>
                    Los despachos se coordinan desde nuestros patios en <Text style={styles.bold}>Easton, Pennsylvania (USA)</Text> para exportación internacional y desde nuestra sede en <Text style={styles.bold}>San José, Costa Rica</Text> para distribución local en Centroamérica.
                  </Text>

                  <Text style={styles.legalSectionTitle}>7. Descargo sobre Marcas de Terceros</Text>
                  <Text style={styles.legalParagraph}>
                    Marcas y nombres comerciales como Cummins, Detroit Diesel, Caterpillar, Eaton Fuller, Meritor, Freightliner, Kenworth, Peterbilt y Mack son marcas registradas de sus respectivos fabricantes. Su mención en este catálogo es con fines estrictamente descriptivos de compatibilidad mecánica y aplicación vehicular.
                  </Text>

                  <Text style={styles.legalSectionTitle}>8. Ley Aplicable y Contacto</Text>
                  <Text style={styles.legalParagraph}>
                    Estos términos se rigen por las leyes comerciales del Estado de Pennsylvania (USA) para exportaciones y por la legislación de la República de Costa Rica para distribución local.
                  </Text>
                  <Text style={styles.legalBullet}>• CJ Trucks Parts LLC / Mills Truck Service</Text>
                  <Text style={styles.legalBullet}>• Web: https://millstruckservices.com</Text>
                  <Text style={styles.legalBullet}>• Tel / WhatsApp CR: +506 7033 4308</Text>
                  <Text style={styles.legalBullet}>• Email: centraljerseymills@gmail.com</Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.legalDate}>Last Updated: October 1, 2026</Text>

                  <Text style={styles.legalSectionTitle}>1. Agreement to Terms</Text>
                  <Text style={styles.legalParagraph}>
                    By downloading, accessing, or using the <Text style={styles.bold}>CJ Trucks Parts</Text> mobile application, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue using the application.
                  </Text>

                  <Text style={styles.legalSectionTitle}>2. Purpose of the Application & Purchase Quotes (Leads)</Text>
                  <Text style={styles.legalParagraph}>
                    This application functions strictly as an interactive digital catalog of heavy-duty replacement truck parts and commercial vehicles available from <Text style={styles.bold}>CJ Trucks Parts LLC</Text> (web platform: <Text style={styles.bold}>millstruckservices.com</Text>).
                  </Text>
                  <Text style={styles.legalParagraph}>
                    <Text style={styles.bold}>Submitting an order or quote request through the application does NOT initiate an automated credit card charge or online financial transaction.</Text> It constitutes a commercial purchase inquiry (lead) submitted to our sales team to verify real-time inventory, calculate freight, and contact you directly to finalize purchase terms outside the app.
                  </Text>

                  <Text style={styles.legalSectionTitle}>3. Pricing & Currency</Text>
                  <Text style={styles.legalParagraph}>
                    Catalog prices are displayed for reference in <Text style={styles.bold}>United States Dollars (USD)</Text> and optionally in <Text style={styles.bold}>Costa Rican Colones (CRC)</Text>. Final invoice totals, applicable taxes, and delivery fees will be confirmed in writing by our sales team prior to payment execution.
                  </Text>

                  <Text style={styles.legalSectionTitle}>4. Guest Order Submission & Communication</Text>
                  <Text style={styles.legalParagraph}>
                    By submitting your contact name and telephone/WhatsApp number, you consent to receive direct contact from our sales representatives via WhatsApp, phone, or email solely to confirm part specifications, stock availability, and dispatch logistics.
                  </Text>

                  <Text style={styles.legalSectionTitle}>5. Commercial Warranty & Return Policy</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Major Mechanical Components:</Text> Diesel engines, transmissions, and differential assemblies carry a limited commercial warranty of 30 to 90 days against internal mechanical defects, effective from delivery date.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Exclusions:</Text> Warranties do not cover damage resulting from improper installation, improper fluids/lubrication, racing, accidents, or unauthorized tampering.</Text>
                  <Text style={styles.legalBullet}>• <Text style={styles.bold}>Returns:</Text> Return requests for incompatible items must be reported within 7 business days following delivery in original uninstalled condition.</Text>

                  <Text style={styles.legalSectionTitle}>6. Shipping & International Logistics</Text>
                  <Text style={styles.legalParagraph}>
                    Orders are dispatched from our export facilities in <Text style={styles.bold}>Easton, Pennsylvania (USA)</Text> and our distribution center in <Text style={styles.bold}>San José, Costa Rica</Text>. Transit times and freight fees will be confirmed directly by your sales representative.
                  </Text>

                  <Text style={styles.legalSectionTitle}>7. Trademark Disclaimer</Text>
                  <Text style={styles.legalParagraph}>
                    Third-party brand names and OEM trademarks (Cummins, Detroit Diesel, Caterpillar, Eaton Fuller, Meritor, Freightliner, Kenworth, Peterbilt, Mack) are the property of their respective owners. Their mention in this catalog is strictly for fitment identification and technical compatibility.
                  </Text>

                  <Text style={styles.legalSectionTitle}>8. Governing Law & Contact</Text>
                  <Text style={styles.legalParagraph}>
                    These terms are governed by the commercial laws of the Commonwealth of Pennsylvania, USA for export orders, and the laws of the Republic of Costa Rica for domestic distribution.
                  </Text>
                  <Text style={styles.legalBullet}>• CJ Trucks Parts LLC / Mills Truck Service</Text>
                  <Text style={styles.legalBullet}>• Website: https://millstruckservices.com</Text>
                  <Text style={styles.legalBullet}>• Phone / WhatsApp CR: +506 7033 4308</Text>
                  <Text style={styles.legalBullet}>• Email: centraljerseymills@gmail.com</Text>
                </View>
              )
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  brandLogo: {
    width: '100%',
    height: 70,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 14,
    lineHeight: 18,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  locationPillText: {
    color: '#1E40AF',
    fontSize: 11,
    fontWeight: '700',
  },
  whatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  whatsAppTextCol: {
    flex: 1,
  },
  whatsAppTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  whatsAppSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  phoneGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  phoneCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  phoneIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  phoneLocation: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  phoneNumber: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
    marginBottom: 1,
  },
  phoneNumberSecondary: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  phoneDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 18,
  },
  locationCard: {
    paddingVertical: 4,
  },
  locationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  countryTag: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countryTagText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  exactAddressText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  exactPhoneText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  policyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  policyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  policySubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  policyDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginVertical: 4,
  },
  transparencyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  transparencyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  transparencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transparencyLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  transparencyValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  transparencyLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emailBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  copyrightText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    padding: 20,
    paddingBottom: 40,
  },
  legalDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
  },
  legalSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
    marginBottom: 6,
  },
  legalParagraph: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 8,
  },
  legalBullet: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: '#0F172A',
  },
});
