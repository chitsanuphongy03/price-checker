import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Switch } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { Product, PromotionType, AppMode } from '../types/promotion';
import { UnitType } from '../constants/units';
import { ProductList } from '../components/ProductList';
import { validateProduct, compareMultipleProducts } from '../utils/priceCalculator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings, useHistory } from '../hooks/useStorage';

const defaultProducts: Product[] = [
  { id: '1', name: '', price: 0, quantity: 1, unit: 'pcs' as UnitType, promotion: { type: PromotionType.NONE, value: 0 } },
  { id: '2', name: '', price: 0, quantity: 1, unit: 'pcs' as UnitType, promotion: { type: PromotionType.NONE, value: 0 } },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t, isThai } = useLanguage();
  const { settings, updateSettings } = useSettings();
  const { addHistory } = useHistory();
  
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [mode, setMode] = useState<AppMode>('simple');
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [calcModalVisible, setCalcModalVisible] = useState(false);

  // Load settings
  useEffect(() => {
    if (settings) {
      setMode(settings.mode);
    }
  }, [settings]);

  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 500 });
    contentOpacity.value = withTiming(1, { duration: 500 });
  }, []);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  const canCompare = useCallback(() => {
    return products.every(p => validateProduct(p).isValid);
  }, [products]);

  const handleCompare = async () => {
    const invalidProducts = products.filter(p => !validateProduct(p).isValid);
    if (invalidProducts.length > 0) {
      Alert.alert(t('error'), t('fillAllProducts') || 'Please fill in all products');
      return;
    }

    // Add default names
    const finalProducts = products.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `${t('product')} ${idx + 1}`,
    }));

    const comparison = compareMultipleProducts(finalProducts);

    // Save to history
    const historyItem = {
      id: Date.now().toString(),
      name: `${t('comparison')} ${new Date().toLocaleDateString()}`,
      timestamp: Date.now(),
      products: finalProducts,
      winner: comparison.winner,
      savingsPercentage: comparison.savingsPercentage,
      mode,
    };
    await addHistory(historyItem);

    navigation.navigate('Result', { comparison, products: finalProducts });
  };

  const toggleMode = () => {
    const newMode = mode === 'simple' ? 'advance' : 'simple';
    setMode(newMode);
    updateSettings({ mode: newMode });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
                {t('appName')}
              </Text>
              <Text style={[styles.subtitle, { fontFamily: getFont('regular', isThai) }]}>
                {t('appSubtitle')}
              </Text>
            </View>
            <View style={styles.modeToggle}>
              <Text style={[styles.modeLabel, { fontFamily: getFont('medium', isThai) }]}>
                {mode === 'simple' ? 'Simple' : 'Advance'}
              </Text>
              <Switch
                value={mode === 'advance'}
                onValueChange={toggleMode}
                trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                thumbColor={mode === 'advance' ? Colors.primary : Colors.card}
              />
            </View>
          </View>
        </Animated.View>

        {/* Product List */}
        <Animated.View style={[styles.flex, contentStyle]}>
          <ProductList
            products={products}
            onUpdate={setProducts}
            activeProductId={activeProductId}
            setActiveProductId={setActiveProductId}
            promoModalVisible={promoModalVisible}
            setPromoModalVisible={setPromoModalVisible}
            calcModalVisible={calcModalVisible}
            setCalcModalVisible={setCalcModalVisible}
          />
        </Animated.View>

        {/* Compare Button */}
        <Animated.View style={[styles.buttonContainer, contentStyle]}>
          <TouchableOpacity 
            style={[styles.compareButton, !canCompare() && styles.buttonDisabled]} 
            onPress={handleCompare}
            disabled={!canCompare()}
          >
            <Text style={[styles.buttonText, { fontFamily: getFont('bold', isThai) }]}>
              {t('compareBestDeal')}
            </Text>
            <Ionicons name="bar-chart" size={18} color={Colors.card} />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modeToggle: {
    alignItems: 'center',
  },
  modeLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  compareButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  buttonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  buttonText: {
    color: Colors.card,
    fontSize: 16,
    marginRight: Spacing.sm,
  },
});
