import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { Product, PromotionType } from '../types/promotion';
import { UnitType } from '../constants/units';
import { useLanguage } from '../hooks/useLanguage';
import { UnitPicker } from './UnitPicker';
import { QuantityPicker } from './QuantityPicker';
import { NoteModal } from './NoteModal';

interface ProductCardProps {
  product: Product;
  onUpdate: (product: Product) => void;
  index: number;
  onOpenPromotion: () => void;
  onOpenCalculator?: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function ProductCard({ 
  product, 
  onUpdate, 
  index, 
  onOpenPromotion, 
  onOpenCalculator,
  canDelete,
  onDelete,
}: ProductCardProps) {
  const { t, isThai } = useLanguage();
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 15 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const updateField = <K extends keyof Product>(field: K, value: Product[K]) => {
    onUpdate({ ...product, [field]: value });
  };

  const getPromotionLabel = () => {
    switch (product.promotion.type) {
      case PromotionType.PERCENTAGE_DISCOUNT: return t('percentageDiscount');
      case PromotionType.FIXED_DISCOUNT: return t('fixedDiscount');
      case PromotionType.BUY_X_GET_Y: return t('buyXGetY');
      case PromotionType.BUNDLE_PRICE: return t('bundlePrice');
      default: return t('noPromotion');
    }
  };

  const renderPromotionInputs = () => {
    const { promotion } = product;
    
    switch (promotion.type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        return (
          <View style={styles.promoInputGroup}>
            <Text style={[styles.promoLabel, { fontFamily: getFont('medium', isThai) }]}>
              {t('discountPercent')}
            </Text>
            <View style={styles.promoInputWrapper}>
              <TextInput
                style={[styles.promoInput, { fontFamily: getFont('regular', isThai) }]}
                value={promotion.value.toString()}
                onChangeText={(text) => {
                  const value = Math.min(100, Math.max(0, parseFloat(text) || 0));
                  updateField('promotion', { ...promotion, value });
                }}
                keyboardType="decimal-pad"
                maxLength={5}
              />
              <Text style={styles.promoSuffix}>%</Text>
            </View>
          </View>
        );

      case PromotionType.FIXED_DISCOUNT:
        return (
          <View style={styles.promoInputGroup}>
            <Text style={[styles.promoLabel, { fontFamily: getFont('medium', isThai) }]}>
              {t('discountAmount')}
            </Text>
            <View style={styles.promoInputWrapper}>
              <Text style={styles.promoPrefix}>$</Text>
              <TextInput
                style={[styles.promoInput, { fontFamily: getFont('regular', isThai) }]}
                value={promotion.value.toString()}
                onChangeText={(text) => {
                  const value = Math.max(0, parseFloat(text) || 0);
                  updateField('promotion', { ...promotion, value });
                }}
                keyboardType="decimal-pad"
                maxLength={8}
              />
            </View>
          </View>
        );

      case PromotionType.BUY_X_GET_Y:
        return (
          <View style={styles.rowInputs}>
            <View style={styles.promoInputGroup}>
              <Text style={[styles.promoLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('buy')}
              </Text>
              <TextInput
                style={[styles.promoInputSingle, { fontFamily: getFont('regular', isThai) }]}
                value={promotion.buyX?.toString() || '2'}
                onChangeText={(text) => {
                  const value = Math.max(1, parseInt(text) || 1);
                  updateField('promotion', { ...promotion, buyX: value });
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={styles.promoInputGroup}>
              <Text style={[styles.promoLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('getFree')}
              </Text>
              <TextInput
                style={[styles.promoInputSingle, { fontFamily: getFont('regular', isThai) }]}
                value={promotion.getY?.toString() || '1'}
                onChangeText={(text) => {
                  const value = Math.max(1, parseInt(text) || 1);
                  updateField('promotion', { ...promotion, getY: value });
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>
        );

      case PromotionType.BUNDLE_PRICE:
        return (
          <View style={styles.rowInputs}>
            <View style={styles.promoInputGroup}>
              <Text style={[styles.promoLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('quantity_short')}
              </Text>
              <TextInput
                style={[styles.promoInputSingle, { fontFamily: getFont('regular', isThai) }]}
                value={promotion.bundleQuantity?.toString() || '3'}
                onChangeText={(text) => {
                  const value = Math.max(2, parseInt(text) || 2);
                  updateField('promotion', { ...promotion, bundleQuantity: value });
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={styles.promoInputGroup}>
              <Text style={[styles.promoLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('forPrice')}
              </Text>
              <View style={styles.promoInputWrapper}>
                <Text style={styles.promoPrefix}>$</Text>
                <TextInput
                  style={[styles.promoInput, { fontFamily: getFont('regular', isThai) }]}
                  value={promotion.value.toString()}
                  onChangeText={(text) => {
                    const value = Math.max(0, parseFloat(text) || 0);
                    updateField('promotion', { ...promotion, value });
                  }}
                  keyboardType="decimal-pad"
                  maxLength={8}
                />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AnimatedView style={[styles.card, animatedStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="cart-outline" size={20} color={Colors.primary} />
          </View>
          <Text style={[styles.title, { fontFamily: getFont('semiBold', isThai) }]}>
            {product.name || `${t('product')} ${index + 1}`}
          </Text>
          <View style={styles.headerActions}>
            {product.notes && (
              <Ionicons name="document-text" size={16} color={Colors.primary} style={styles.noteIcon} />
            )}
            {canDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: getFont('medium', isThai) }]}>
            {t('name')}
          </Text>
          <TextInput
            style={[styles.inputSingle, { fontFamily: getFont('regular', isThai) }]}
            value={product.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder={`${t('product')} ${index + 1}`}
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Price Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: getFont('medium', isThai) }]}>
            {t('price')}
          </Text>
          <View style={styles.inputWrapper}>
            <Text style={[styles.currency, { fontFamily: getFont('regular', isThai) }]}>$</Text>
            <TextInput
              style={[styles.input, { fontFamily: getFont('regular', isThai) }]}
              value={product.price > 0 ? product.price.toString() : ''}
              onChangeText={(text) => updateField('price', parseFloat(text) || 0)}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Quantity with Unit */}
        <View style={styles.inputGroup}>
          <View style={styles.quantityHeader}>
            <Text style={[styles.label, { fontFamily: getFont('medium', isThai) }]}>
              {t('quantity')}
            </Text>
            {onOpenCalculator && (
              <TouchableOpacity onPress={onOpenCalculator} style={styles.calcButton}>
                <Ionicons name="calculator-outline" size={16} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.quantityRow}>
            <QuantityPicker
              value={product.quantity}
              onSelect={(value) => updateField('quantity', value)}
              min={0}
              max={9999}
            />
            <UnitPicker
              value={product.unit}
              onSelect={(unit) => updateField('unit', unit)}
            />
          </View>
        </View>

        {/* Promotion Dropdown */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: getFont('medium', isThai) }]}>
            {t('promotion')}
          </Text>
          <TouchableOpacity style={styles.dropdown} onPress={onOpenPromotion}>
            <Text style={[styles.dropdownText, { fontFamily: getFont('regular', isThai) }]}>
              {getPromotionLabel()}
            </Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Dynamic Promotion Inputs */}
        {renderPromotionInputs()}

        {/* Note Button */}
        <TouchableOpacity style={styles.noteButton} onPress={() => setNoteModalVisible(true)}>
          <Ionicons name="create-outline" size={16} color={Colors.primary} />
          <Text style={[styles.noteButtonText, { fontFamily: getFont('medium', isThai) }]}>
            {product.notes ? t('editNote') : t('addNote')}
          </Text>
        </TouchableOpacity>
      </AnimatedView>

      <NoteModal
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        onSave={(note) => updateField('notes', note)}
        initialNote={product.notes}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteIcon: {
    marginRight: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },
  currency: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
  },
  inputSingle: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
  },
  quantityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcButton: {
    padding: Spacing.xs,
  },
  quantityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.text,
  },
  // Promo inputs
  promoInputGroup: {
    marginTop: Spacing.sm,
  },
  promoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  promoInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },
  promoInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
  },
  promoInputSingle: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
  promoPrefix: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  promoSuffix: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  noteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  noteButtonText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
});
