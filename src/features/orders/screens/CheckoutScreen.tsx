import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../navigation/types';
import { useCart } from '../../cart/context/CartContext';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { ContactMethod } from '../types/order.types';
import { useLanguage } from '../../../i18n/LanguageContext';
import { useCurrency } from '../../../context/CurrencyContext';

type NavProps = NativeStackNavigationProp<RootStackParamList>;

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavProps>();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { mutate: submitOrder, isPending } = useCreateOrder();
  const { t, isSpanish } = useLanguage();
  const { currency, getPriceInfo, formatAmount } = useCurrency();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<ContactMethod>('WhatsApp');
  const [customerAddress, setCustomerAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);

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

  const contactMethods: ContactMethod[] = ['WhatsApp', 'Phone Call', 'Email'];

  const handleSubmitOrder = () => {
    if (!customerName.trim()) {
      Alert.alert(
        isSpanish ? 'Campo Requerido' : 'Required Field',
        isSpanish ? 'Por favor ingresa tu nombre completo o empresa.' : 'Please enter your full name or company name.'
      );
      return;
    }

    if (!customerPhone.trim()) {
      Alert.alert(
        isSpanish ? 'Campo Requerido' : 'Required Field',
        isSpanish
          ? 'Por favor ingresa tu teléfono o WhatsApp para contactarte.'
          : 'Please enter your phone or WhatsApp number so we can contact you.'
      );
      return;
    }

    if (items.length === 0) {
      Alert.alert(
        isSpanish ? 'Carrito Vacío' : 'Empty Cart',
        isSpanish ? 'No hay repuestos en tu carrito.' : 'There are no items in your cart.'
      );
      navigation.goBack();
      return;
    }

    const currencyNote = `Moneda seleccionada: ${currency}`;
    const finalNotes = notes.trim()
      ? `${notes.trim()}\n(${currencyNote})`
      : currencyNote;

    const payload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      preferredContactMethod,
      customerAddress: customerAddress.trim() || undefined,
      notes: finalNotes,
      items: items.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
      })),
    };

    submitOrder(payload, {
      onSuccess: (res: any) => {
        const orderNum =
          res?.orderNumber ||
          res?.order?.orderNumber ||
          'LD-' + Math.floor(100000 + Math.random() * 900000);

        setSubmittedOrderNumber(orderNum);
        clearCart();
      },
      onError: (err: any) => {
        console.warn('Checkout error:', err);
        Alert.alert(
          'Connection Notice',
          'Could not connect to the server. Please check your internet connection or try again.'
        );
      },
    });
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello CJ Trucks Parts, I have submitted order request #${submittedOrderNumber} via the app. My name is ${customerName}.`
    );
    // WhatsApp Central de Ventas
    const url = `https://wa.me/50670334308?text=${text}`;
    Linking.openURL(url).catch(() => {
      navigation.popToTop();
    });
  };

  // Pantalla de Pedido Confirmado
  if (submittedOrderNumber) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-circle" size={54} color="#16A34A" />
          </View>
          <Text style={styles.successTitle}>
            {isSpanish
              ? '¡Solicitud de Pedido Enviada con Éxito!'
              : 'Order Request Sent Successfully!'}
          </Text>
          <Text style={styles.orderNumberLabel}>
            {isSpanish ? 'Número de Orden Asignado:' : 'Assigned Order Number:'}
          </Text>
          <View style={styles.orderNumberBox}>
            <Text style={styles.orderNumberValue}>{submittedOrderNumber}</Text>
          </View>

          <Text style={styles.successMessage}>
            {isSpanish
              ? `Tu solicitud ha sido registrada en nuestro sistema ERP. El equipo de ventas de CJ Trucks Parts te contactará a la brevedad vía ${preferredContactMethod} para confirmar disponibilidad, precios y entrega.`
              : `Your order request has been registered in our ERP system. The CJ Trucks Parts sales team will contact you shortly via ${preferredContactMethod} to confirm availability and delivery.`}
          </Text>

          <Pressable style={styles.whatsAppBtn} onPress={handleOpenWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.whatsAppBtnText}>{t('contact_sales')}</Text>
          </Pressable>

          <Pressable
            style={styles.doneBtn}
            onPress={() => {
              navigation.popToTop();
            }}
          >
            <Ionicons name="home-outline" size={18} color="#334155" style={{ marginRight: 6 }} />
            <Text style={styles.doneBtnText}>
              {isSpanish ? 'Volver al Catálogo' : 'Return to Catalog'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.topNav}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </Pressable>
        <Text style={styles.navTitle}>
          {isSpanish ? 'Confirmar Solicitud' : 'Confirm Request'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Tarjeta de Resumen Rápido */}
          <View style={styles.orderSummaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryTitle}>
                {isSpanish ? 'Resumen del Pedido' : 'Cart Summary'}
              </Text>
              <Text style={styles.summaryCount}>
                {items.length} {isSpanish ? 'repuestos' : 'items'}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            {items.slice(0, 3).map((item) => {
              const priceInfo = getPriceInfo(item.product);
              const lineTotal = priceInfo.amount * item.quantity;
              return (
                <View key={item.product.productId} style={styles.miniItemRow}>
                  <Text style={styles.miniItemName} numberOfLines={1}>
                    {item.quantity}x {item.product.name}
                  </Text>
                  <Text style={styles.miniItemPrice}>
                    {priceInfo.currency === 'CRC' ? '₡' : '$'}
                    {lineTotal.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    {priceInfo.isFallback && ' (USD)'}
                  </Text>
                </View>
              );
            })}
            {items.length > 3 && (
              <Text style={styles.moreItemsText}>
                + {items.length - 3} {isSpanish ? 'repuestos más...' : 'more items...'}
              </Text>
            )}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {isSpanish ? `Total Estimado (${currency}):` : `Estimated Total (${currency}):`}
              </Text>
              <Text style={styles.totalAmount}>
                {activeTotalDisplay}
              </Text>
            </View>
          </View>

          {/* Formulario de Contacto (Guest Checkout) */}
          <View style={styles.formContainer}>
            <Text style={styles.formSectionTitle}>
              {isSpanish ? 'Datos de Contacto' : 'Contact Information'}
            </Text>
            <Text style={styles.formSectionSub}>
              {isSpanish
                ? 'Nuestro equipo de ventas te contactará para coordinar precios, garantía y entrega.'
                : 'Our sales team will contact you to coordinate pricing and delivery.'}
            </Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                {isSpanish ? 'Nombre Completo / Empresa *' : 'Full Name / Company Name *'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  isSpanish
                    ? 'Ej. Juan Pérez o Transportes del Norte'
                    : 'e.g. John Smith or Transportes LLC'
                }
                placeholderTextColor="#94A3B8"
                value={customerName}
                onChangeText={setCustomerName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                {isSpanish ? 'Teléfono / WhatsApp *' : 'Phone / WhatsApp Number *'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  isSpanish
                    ? 'Ej. +506 7033-4308 o +1 (305) 555-0199'
                    : 'e.g. +506 7033-4308 or +1 (305) 555-0199'
                }
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={customerPhone}
                onChangeText={setCustomerPhone}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                {isSpanish ? 'Correo Electrónico (Opcional)' : 'Email Address (Optional)'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={customerEmail}
                onChangeText={setCustomerEmail}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                {isSpanish ? 'Método de Contacto Preferido' : 'Preferred Contact Method'}
              </Text>
              <View style={styles.methodsRow}>
                {contactMethods.map((method) => {
                  const isSelected = preferredContactMethod === method;
                  const iconName =
                    method === 'WhatsApp'
                      ? 'logo-whatsapp'
                      : method === 'Phone Call'
                      ? 'call-outline'
                      : 'mail-outline';
                  const iconColor = isSelected
                    ? '#1D4ED8'
                    : method === 'WhatsApp'
                    ? '#25D366'
                    : '#64748B';

                  const methodLabel =
                    method === 'WhatsApp'
                      ? 'WhatsApp'
                      : method === 'Phone Call'
                      ? isSpanish
                        ? 'Llamada'
                        : 'Phone Call'
                      : isSpanish
                      ? 'Correo'
                      : 'Email';

                  return (
                    <Pressable
                      key={method}
                      style={[styles.methodBtn, isSelected && styles.methodBtnSelected]}
                      onPress={() => setPreferredContactMethod(method)}
                    >
                      <Ionicons
                        name={iconName as any}
                        size={15}
                        color={iconColor}
                        style={{ marginRight: 5 }}
                      />
                      <Text style={[styles.methodBtnText, isSelected && styles.methodBtnTextSelected]}>
                        {methodLabel}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                {isSpanish
                  ? 'Dirección o Ciudad de Entrega (Opcional)'
                  : 'Delivery / Shipping Address (Optional)'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={
                  isSpanish
                    ? 'Ej. Easton, PA / San José / Taller central...'
                    : 'e.g. City, workshop address, or freight yard'
                }
                placeholderTextColor="#94A3B8"
                value={customerAddress}
                onChangeText={setCustomerAddress}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                {isSpanish
                  ? 'Notas o Requerimientos de la Pieza (VIN)'
                  : 'Notes or Specific Requests (Optional)'}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={
                  isSpanish
                    ? 'Número de VIN/chasis, urgencia o detalles adicionales...'
                    : 'Chassis VIN number, urgency, or delivery instructions...'
                }
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.submitBtn, isPending && styles.submitBtnDisabled]}
            onPress={handleSubmitOrder}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.submitBtnRow}>
                <Ionicons name="paper-plane-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>
                  {isSpanish ? 'Enviar Solicitud de Pedido' : 'Submit Order Request'}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  placeholder: {
    width: 36,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  orderSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryCount: {
    fontSize: 12,
    color: '#64748B',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  miniItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  miniItemName: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    marginRight: 8,
  },
  miniItemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#2563EB',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2563EB',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  formSectionSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
    lineHeight: 18,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  methodsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  methodBtnSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  methodBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  methodBtnTextSelected: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  orderNumberLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
    textTransform: 'uppercase',
  },
  orderNumberBox: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  orderNumberValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1D4ED8',
    letterSpacing: 1,
  },
  successMessage: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  whatsAppBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  whatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  doneBtn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
  },
});
