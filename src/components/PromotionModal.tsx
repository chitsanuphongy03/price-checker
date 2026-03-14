import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { PromotionType } from '../types/promotion';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings } from '../hooks/useStorage';

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
  const { settings } = useSettings();
  const currencySymbol = settings?.currency || '฿';
  const [selectedType, setSelectedType] = useState<PromotionType>(currentPromotion.type);
  
  // Form values
  const [percentValue, setPercentValue] = useState('10');
  const [fixedValue, setFixedValue] = useState('10');
  const [buyX, setBuyX] = useState('2');
  const [getY, setGetY] = useState('1');
  const [bundleQty, setBundleQty] = useState('3');
  const [bundlePrice, setBundlePrice] = useState('100');

  // Reset values when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedType(currentPromotion.type);
      if (currentPromotion.type === PromotionType.PERCENTAGE_DISCOUNT) {
        setPercentValue(currentPromotion.value > 0 ? currentPromotion.value.toString() : '10');
      }
      if (currentPromotion.type === PromotionType.FIXED_DISCOUNT) {
        setFixedValue(currentPromotion.value > 0 ? currentPromotion.value.toString() : '10');
      }
      if (currentPromotion.type === PromotionType.BUY_X_GET_Y) {
        setBuyX(currentPromotion.buyX?.toString() || '2');
        setGetY(currentPromotion.getY?.toString() || '1');
      }
      if (currentPromotion.type === PromotionType.BUNDLE_PRICE) {
        setBundleQty(currentPromotion.bundleQuantity?.toString() || '3');
        setBundlePrice(currentPromotion.value > 0 ? currentPromotion.value.toString() : '100');
      }
    }
  }, [visible, currentPromotion]);

  const handleSelectType = (type: PromotionType) => {
    setSelectedType(type);
    if (type === PromotionType.NONE) {
      handleApply(type);
    }
  };

  const handleApply = (type: PromotionType = selectedType) => {
    const newPromotion: { type: PromotionType; value: number; buyX?: number; getY?: number; bundleQuantity?: number } = { 
      type, 
      value: 0 
    };
    
    switch (type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        newPromotion.value = parseFloat(percentValue) || 0;
        break;
      case PromotionType.FIXED_DISCOUNT:
        newPromotion.value = parseFloat(fixedValue) || 0;
        break;
      case PromotionType.BUY_X_GET_Y:
        newPromotion.buyX = parseInt(buyX) || 2;
        newPromotion.getY = parseInt(getY) || 1;
        break;
      case PromotionType.BUNDLE_PRICE:
        newPromotion.bundleQuantity = parseInt(bundleQty) || 3;
        newPromotion.value = parseFloat(bundlePrice) || 0;
        break;
    }
    
    onSelect(newPromotion);
  };

  const renderInputs = () => {
    switch (selectedType) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { fontFamily: getFont('medium', isThai) }]}>
              {t('discountPercent')}
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { fontFamily: getFont('bold', isThai) }]}
                value={percentValue}
                onChangeText={setPercentValue}
                keyboardType="decimal-pad"
                maxLength={5}
              />
              <Text style={styles.inputSuffix}>%</Text>
            </View>
          </View>
        );
      
      case PromotionType.FIXED_DISCOUNT:
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { fontFamily: getFont('medium', isThai) }]}>
              {t('discountAmount')}
            </Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputPrefix}>{currencySymbol}</Text>
              <TextInput
                style={[styles.input, { fontFamily: getFont('bold', isThai) }]}
                value={fixedValue}
                onChangeText={setFixedValue}
                keyboardType="decimal-pad"
                maxLength={8}
              />
            </View>
          </View>
        );
      
      case PromotionType.BUY_X_GET_Y:
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { fontFamily: getFont('medium', isThai) }]}>
              {t('buyXGetY')}
            </Text>
            <View style={styles.buyGetRow}>
              <View style={styles.buyGetInput}>
                <Text style={[styles.smallLabel, { fontFamily: getFont('regular', isThai) }]}>
                  {t('buy')}
                </Text>
                <TextInput
                  style={[styles.smallInput, { fontFamily: getFont('bold', isThai) }]}
                  value={buyX}
                  onChangeText={setBuyX}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              <Text style={styles.buyGetSeparator}>:</Text>
              <View style={styles.buyGetInput}>
                <Text style={[styles.smallLabel, { fontFamily: getFont('regular', isThai) }]}>
                  {t('getFree')}
                </Text>
                <TextInput
                  style={[styles.smallInput, { fontFamily: getFont('bold', isThai) }]}
                  value={getY}
                  onChangeText={setGetY}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
            </View>
          </View>
        );
      
      case PromotionType.BUNDLE_PRICE:
        return (
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { fontFamily: getFont('medium', isThai) }]}>
              {t('bundlePrice')}
            </Text>
            <View style={styles.bundleRow}>
              <View style={styles.bundleInput}>
                <Text style={[styles.smallLabel, { fontFamily: getFont('regular', isThai) }]}>
                  {t('quantity')}
                </Text>
                <TextInput
                  style={[styles.smallInput, { fontFamily: getFont('bold', isThai) }]}
                  value={bundleQty}
                  onChangeText={setBundleQty}
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              <View style={styles.bundleInput}>
                <Text style={[styles.smallLabel, { fontFamily: getFont('regular', isThai) }]}>
                  {t('forPrice')}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.smallPrefix}>{currencySymbol}</Text>
                  <TextInput
                    style={[styles.smallInput, styles.smallInputFlex, { fontFamily: getFont('bold', isThai) }]}
                    value={bundlePrice}
                    onChangeText={setBundlePrice}
                    keyboardType="decimal-pad"
                    maxLength={8}
                  />
                </View>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
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
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.optionsContainer}>
              {promotionOptions.map((option) => (
                <TouchableOpacity
                  key={option.type}
                  style={[
                    styles.option,
                    selectedType === option.type && styles.optionSelected,
                  ]}
                  onPress={() => handleSelectType(option.type)}
                >
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={option.icon as keyof typeof Ionicons.glyphMap}
                      size={22}
                      color={selectedType === option.type ? Colors.primary : Colors.textSecondary}
                      style={styles.optionIcon}
                    />
                    <Text style={[
                      styles.optionLabel,
                      { fontFamily: getFont('medium', isThai) },
                      selectedType === option.type && styles.optionLabelSelected,
                    ]}>
                      {t(option.key as any)}
                    </Text>
                  </View>
                  {selectedType === option.type && (
                    <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Dynamic Inputs */}
            {renderInputs()}

            {/* Apply Button */}
            {selectedType !== PromotionType.NONE && (
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => handleApply()}
              >
                <Text style={[styles.applyButtonText, { fontFamily: getFont('bold', isThai) }]}>
                  {t('apply') || 'ใช้งาน'}
                </Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.bottomSpacer} />
          </ScrollView>
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
    maxWidth: 340,
    maxHeight: '80%',
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
  inputSection: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
  },
  inputPrefix: {
    fontSize: 16,
    color: Colors.textMuted,
    marginRight: Spacing.xs,
  },
  inputSuffix: {
    fontSize: 20,
    color: Colors.textMuted,
    marginLeft: Spacing.xs,
  },
  buyGetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  buyGetInput: {
    alignItems: 'center',
  },
  buyGetSeparator: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: 'bold',
    marginTop: 20,
  },
  smallLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  smallInput: {
    width: 80,
    height: 48,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
  },
  smallInputFlex: {
    flex: 1,
    width: undefined,
  },
  bundleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  bundleInput: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    paddingLeft: Spacing.sm,
  },
  smallPrefix: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  applyButtonText: {
    fontSize: 16,
    color: Colors.card,
  },
  bottomSpacer: {
    height: 20,
  },
});
