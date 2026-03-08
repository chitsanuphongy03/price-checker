import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { PromotionType } from '../types/promotion';
import { useLanguage } from '../hooks/useLanguage';

interface PromotionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (promotion: { type: PromotionType; value: number; buyX?: number; getY?: number; bundleQuantity?: number }) => void;
  currentPromotion: { type: PromotionType; value: number; buyX?: number; getY?: number; bundleQuantity?: number };
}

const promotionOptions = [
  { type: PromotionType.NONE, key: 'noPromotion', icon: 'checkmark-circle-outline' },
  { type: PromotionType.PERCENTAGE_DISCOUNT, key: 'percentageDiscount', icon: 'pricetag-outline' },
  { type: PromotionType.FIXED_DISCOUNT, key: 'fixedDiscount', icon: 'cash-outline' },
  { type: PromotionType.BUY_X_GET_Y, key: 'buyXGetY', icon: 'gift-outline' },
  { type: PromotionType.BUNDLE_PRICE, key: 'bundlePrice', icon: 'cube-outline' },
];

export function PromotionModal({ visible, onClose, onSelect, currentPromotion }: PromotionModalProps) {
  const { t, isThai } = useLanguage();

  const handleSelect = (type: PromotionType) => {
    const newPromotion: { type: PromotionType; value: number; buyX?: number; getY?: number; bundleQuantity?: number } = { type, value: 0 };
    
    switch (type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        newPromotion.value = currentPromotion.type === type ? currentPromotion.value : 10;
        break;
      case PromotionType.FIXED_DISCOUNT:
        newPromotion.value = currentPromotion.type === type ? currentPromotion.value : 5;
        break;
      case PromotionType.BUY_X_GET_Y:
        newPromotion.buyX = currentPromotion.type === type ? currentPromotion.buyX || 2 : 2;
        newPromotion.getY = currentPromotion.type === type ? currentPromotion.getY || 1 : 1;
        break;
      case PromotionType.BUNDLE_PRICE:
        newPromotion.bundleQuantity = currentPromotion.type === type ? currentPromotion.bundleQuantity || 3 : 3;
        newPromotion.value = currentPromotion.type === type ? currentPromotion.value : 10;
        break;
    }
    
    onSelect(newPromotion);
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
              {t('selectPromotion')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.optionsContainer}>
            {promotionOptions.map((option) => (
              <TouchableOpacity
                key={option.type}
                style={[
                  styles.option,
                  currentPromotion.type === option.type && styles.optionSelected,
                ]}
                onPress={() => handleSelect(option.type)}
              >
                <View style={styles.optionLeft}>
                  <Ionicons
                    name={option.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={currentPromotion.type === option.type ? Colors.primary : Colors.textSecondary}
                    style={styles.optionIcon}
                  />
                  <Text style={[
                    styles.optionLabel,
                    { fontFamily: getFont('medium', isThai) },
                    currentPromotion.type === option.type && styles.optionLabelSelected,
                  ]}>
                    {t(option.key as any)}
                  </Text>
                </View>
                {currentPromotion.type === option.type && (
                  <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 320,
    padding: Spacing.lg,
    ...Shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
  },
  optionSelected: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: Spacing.md,
  },
  optionLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
});
