import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BorderRadius, Colors, Shadows, Spacing } from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";
import { useSettings } from "../hooks/useStorage";
import { Promotion, PromotionType } from "../types/promotion";

interface PromotionSelectorProps {
  promotion: Promotion;
  onChange: (promotion: Promotion) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PromotionSelector({
  promotion,
  onChange,
}: PromotionSelectorProps) {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const currencySymbol = settings?.currency || '฿';
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const handlePressIn = () => {
    scaleValue.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15 });
  };

  const handleSelectType = (type: PromotionType) => {
    const newPromotion: Promotion = { type, value: 0 };

    // Set default values based on type
    switch (type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        newPromotion.value = 10;
        break;
      case PromotionType.FIXED_DISCOUNT:
        newPromotion.value = 5;
        break;
      case PromotionType.BUY_X_GET_Y:
        newPromotion.buyX = 2;
        newPromotion.getY = 1;
        break;
      case PromotionType.BUNDLE_PRICE:
        newPromotion.bundleQuantity = 3;
        newPromotion.value = 10;
        break;
    }

    onChange(newPromotion);
    setModalVisible(false);
  };

  const promotionOptions = [
    { type: PromotionType.NONE, label: t("noPromotion"), icon: "✓" },
    {
      type: PromotionType.PERCENTAGE_DISCOUNT,
      label: t("percentageDiscount"),
      icon: "%",
    },
    {
      type: PromotionType.FIXED_DISCOUNT,
      label: t("fixedDiscount"),
      icon: currencySymbol,
    },
    { type: PromotionType.BUY_X_GET_Y, label: t("buyXGetY"), icon: "🎁" },
    { type: PromotionType.BUNDLE_PRICE, label: t("bundlePrice"), icon: "📦" },
  ];

  const getCurrentOption = () => {
    return (
      promotionOptions.find((opt) => opt.type === promotion.type) ||
      promotionOptions[0]
    );
  };

  const renderPromotionInputs = () => {
    switch (promotion.type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        return (
          <View style={styles.promotionInputContainer}>
            <Text style={styles.promotionInputLabel}>
              {t("discountPercent")}
            </Text>
            <View style={styles.inlineInputContainer}>
              <TextInput
                style={styles.inlineInput}
                value={promotion.value.toString()}
                onChangeText={(text) => {
                  const value = Math.min(
                    100,
                    Math.max(0, parseFloat(text) || 0),
                  );
                  onChange({ ...promotion, value });
                }}
                keyboardType="decimal-pad"
                maxLength={5}
              />
              <Text style={styles.inlineInputSuffix}>%</Text>
            </View>
          </View>
        );

      case PromotionType.FIXED_DISCOUNT:
        return (
          <View style={styles.promotionInputContainer}>
            <Text style={styles.promotionInputLabel}>
              {t("discountAmount")}
            </Text>
            <View style={styles.inlineInputContainer}>
              <Text style={styles.inlineInputPrefix}>{currencySymbol}</Text>
              <TextInput
                style={styles.inlineInput}
                value={promotion.value.toString()}
                onChangeText={(text) => {
                  const value = Math.max(0, parseFloat(text) || 0);
                  onChange({ ...promotion, value });
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
            <View
              style={[
                styles.promotionInputContainer,
                { flex: 1, marginRight: Spacing.sm },
              ]}
            >
              <Text style={styles.promotionInputLabel}>{t("buy")}</Text>
              <TextInput
                style={styles.inlineInput}
                value={promotion.buyX?.toString() || "2"}
                onChangeText={(text) => {
                  const value = Math.max(1, parseInt(text) || 1);
                  onChange({ ...promotion, buyX: value });
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={[styles.promotionInputContainer, { flex: 1 }]}>
              <Text style={styles.promotionInputLabel}>{t("getFree")}</Text>
              <TextInput
                style={styles.inlineInput}
                value={promotion.getY?.toString() || "1"}
                onChangeText={(text) => {
                  const value = Math.max(1, parseInt(text) || 1);
                  onChange({ ...promotion, getY: value });
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
            <View
              style={[
                styles.promotionInputContainer,
                { flex: 1, marginRight: Spacing.sm },
              ]}
            >
              <Text style={styles.promotionInputLabel}>
                {t("quantity_short")}
              </Text>
              <TextInput
                style={styles.inlineInput}
                value={promotion.bundleQuantity?.toString() || "3"}
                onChangeText={(text) => {
                  const value = Math.max(2, parseInt(text) || 2);
                  onChange({ ...promotion, bundleQuantity: value });
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={[styles.promotionInputContainer, { flex: 1 }]}>
              <Text style={styles.promotionInputLabel}>{t("forPrice")}</Text>
              <View style={styles.inlineInputContainer}>
                <Text style={styles.inlineInputPrefix}>{currencySymbol}</Text>
                <TextInput
                  style={styles.inlineInput}
                  value={promotion.value.toString()}
                  onChangeText={(text) => {
                    const value = Math.max(0, parseFloat(text) || 0);
                    onChange({ ...promotion, value });
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

  const currentOption = getCurrentOption();

  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>{t("promotion")}</Text>

      <AnimatedTouchable
        style={[styles.selector, animatedStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <View style={styles.selectorIcon}>
          <Text style={styles.selectorIconText}>{currentOption.icon}</Text>
        </View>
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLabel}>{currentOption.label}</Text>
        </View>
        <Text style={styles.chevron}>⌄</Text>
      </AnimatedTouchable>

      {/* Additional inputs based on promotion type */}
      {renderPromotionInputs()}

      {/* Modal for selecting promotion type */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("selectPromotion")}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {promotionOptions.map((option) => (
                <TouchableOpacity
                  key={option.type}
                  style={[
                    styles.optionItem,
                    promotion.type === option.type && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelectType(option.type)}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      promotion.type === option.type &&
                        styles.optionIconSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionIconText,
                        promotion.type === option.type &&
                          styles.optionIconTextSelected,
                      ]}
                    >
                      {option.icon}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      promotion.type === option.type &&
                        styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {promotion.type === option.type && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectorIcon: {
    marginRight: Spacing.sm,
  },
  selectorIconText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  selectorContent: {
    flex: 1,
  },
  selectorLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  selectorHint: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: "400",
  },
  promotionInputContainer: {
    marginTop: Spacing.sm,
  },
  promotionInputLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  rowInputs: {
    flexDirection: "row",
    marginTop: Spacing.sm,
  },
  inlineInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.md,
    borderWidth: 0,
    paddingHorizontal: Spacing.sm,
  },
  inlineInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
  },
  inlineInputPrefix: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  inlineInputSuffix: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    maxHeight: "70%",
    ...Shadows.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  optionItemSelected: {
    backgroundColor: Colors.primary + "10",
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  optionIconSelected: {
    backgroundColor: Colors.primary,
  },
  optionIconText: {
    fontSize: 18,
  },
  optionIconTextSelected: {
    color: Colors.card,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  optionLabelSelected: {
    fontWeight: "700",
    color: Colors.primary,
  },
  checkmark: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: "700",
  },
});
