import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AppSplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onFinish,
  minDurationMs = 1500,
}) => {
  const [visible, setVisible] = useState(true);

  // Valores animados
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const footerFadeAnim = useRef(new Animated.Value(0)).current;
  const containerFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Animación de entrada para Logo y progreso
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: minDurationMs,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.delay(350),
        Animated.timing(footerFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Transición suave de salida al terminar el tiempo mínimo
    const timer = setTimeout(() => {
      Animated.timing(containerFadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onFinish?.();
      });
    }, minDurationMs + 100);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, progressAnim, footerFadeAnim, containerFadeAnim, minDurationMs, onFinish]);

  if (!visible) return null;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.overlay,
        {
          opacity: containerFadeAnim,
        },
      ]}
    >
      {/* Centro: Logo + Subtítulo + Barra de carga con brillo */}
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.metaWrapper, { opacity: footerFadeAnim }]}>
          <Text style={styles.tagline}>COMMERCIAL TRUCK PARTS & FLEETS</Text>

          {/* Barra de progreso elegante en color rojo corporativo */}
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
        </Animated.View>
      </View>

      {/* Footer corporativo */}
      <Animated.View style={[styles.footer, { opacity: footerFadeAnim }]}>
        <View style={styles.locationsRow}>
          <View style={styles.badgeItem}>
            <View style={[styles.badgeDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.badgeText}>Easton, PA</Text>
          </View>
          <Text style={styles.badgeDivider}>•</Text>
          <View style={styles.badgeItem}>
            <View style={[styles.badgeDot, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.badgeText}>San José, CR</Text>
          </View>
        </View>
        <Text style={styles.websiteUrl}>millstruckservices.com</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 99999,
    elevation: 99999,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  brandLogo: {
    width: Math.min(SCREEN_WIDTH * 0.78, 320),
    height: 90,
  },
  metaWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBarTrack: {
    width: 160,
    height: 3.5,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 3,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  locationsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  badgeDivider: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  websiteUrl: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
});
