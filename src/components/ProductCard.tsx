import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  getFont,
} from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";
import { useSettings } from "../hooks/useStorage";
import { Product, PromotionType } from "../types/promotion";
import { NoteModal } from "./NoteModal";
import { QuantityPicker } from "./QuantityPicker";
import { UnitPicker } from "./UnitPicker";

interface ProductCardProps {
  product: Product;
  onUpdate: (product: Product) => void;
  index: number;
  onOpenPromotion: () => void;
  canDelete?: boolean;
  onDelete?: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function ProductCard({
  product,
  onUpdate,
  index,
  onOpenPromotion,
  canDelete,
  onDelete,
}: ProductCardProps) {
  const { t, isThai } = useLanguage();
  const { settings } = useSettings();
  const currencySymbol = settings?.currency || '฿';
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 15 });
  });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const updateField = <K extends keyof Product>(
    field: K,
    value: Product[K],
  ) => {
    onUpdate({ ...product, [field]: value });
  };

  const getPromotionLabel = () => {
    switch (product.promotion.type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        return t("percentageDiscount");
      case PromotionType.FIXED_DISCOUNT:
        return t("fixedDiscount");
      case PromotionType.BUY_X_GET_Y:
        return t("buyXGetY");
      case PromotionType.BUNDLE_PRICE:
        return t("bundlePrice");
      default:
        return t("noPromotion");
    }
  };

  const renderPromotionInputs = () => {
    const { promotion } = product;

    switch (promotion.type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        return (
          <View style={styles.promoInputGroup}>
            <Text
              style={[
                styles.promoLabel,
                { fontFamily: getFont("medium", isThai) },
              ]}
            >
              {t("discountPercent")}
            </Text>
            <View style={styles.promoInputWrapper}>
              <TextInput
                style={[
                  styles.promoInput,
                  { fontFamily: getFont("regular", isThai) },
                ]}
                value={promotion.value.toString()}
                onChangeText={(text) => {
                  const value = Math.min(
                    100,
                    Math.max(0, parseFloat(text) || 0),
                  );
                  updateField("promotion", { ...promotion, value });
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
            <Text
              style={[
                styles.promoLabel,
                { fontFamily: getFont("medium", isThai) },
              ]}
            >
              {t("discountAmount")}
            </Text>
            <View style={styles.promoInputWrapper}>
              <Text style={styles.promoPrefix}>{currencySymbol}</Text>
              <TextInput
                style={[
                  styles.promoInput,
                  { fontFamily: getFont("regular", isThai) },
                ]}
                value={promotion.value.toString()}
                onChangeText={(text) => {
                  const value = Math.max(0, parseFloat(text) || 0);
                  updateField("promotion", { ...promotion, value });
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
              <Text
                style={[
                  styles.promoLabel,
                  { fontFamily: getFont("medium", isThai) },
                ]}
              >
                {t("buy")}
              </Text>
              <TextInput
                style={[
                  styles.promoInputSingle,
                  { fontFamily: getFont("regular", isThai) },
                ]}
                value={promotion.buyX?.toString() || "2"}
                onChangeText={(text) => {
                  const value = Math.max(1, parseInt(text) || 1);
                  updateField("promotion", { ...promotion, buyX: value });
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={styles.promoInputGroup}>
              <Text
                style={[
                  styles.promoLabel,
                  { fontFamily: getFont("medium", isThai) },
                ]}
              >
                {t("getFree")}
              </Text>
              <TextInput
                style={[
                  styles.promoInputSingle,
                  { fontFamily: getFont("regular", isThai) },
                ]}
                value={promotion.getY?.toString() || "1"}
                onChangeText={(text) => {
                  const value = Math.max(1, parseInt(text) || 1);
                  updateField("promotion", { ...promotion, getY: value });
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
              <Text
                style={[
                  styles.promoLabel,
                  { fontFamily: getFont("medium", isThai) },
                ]}
              >
                {t("quantity_short")}
              </Text>
              <TextInput
                style={[
                  styles.promoInputSingle,
                  { fontFamily: getFont("regular", isThai) },
                ]}
                value={promotion.bundleQuantity?.toString() || "3"}
                onChangeText={(text) => {
                  const value = Math.max(2, parseInt(text) || 2);
                  updateField("promotion", {
                    ...promotion,
                    bundleQuantity: value,
                  });
                }}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={styles.promoInputGroup}>
              <Text
                style={[
                  styles.promoLabel,
                  { fontFamily: getFont("medium", isThai) },
                ]}
              >
                {t("forPrice")}
              </Text>
              <View style={styles.promoInputWrapper}>
                <Text style={styles.promoPrefix}>$</Text>
                <TextInput
                  style={[
                    styles.promoInput,
                    { fontFamily: getFont("regular", isThai) },
                  ]}
                  value={promotion.value.toString()}
                  onChangeText={(text) => {
                    const value = Math.max(0, parseFloat(text) || 0);
                    updateField("promotion", { ...promotion, value });
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
          <View style={styles.productNumber}>
            <Text
              style={[
                styles.productNumberText,
                { fontFamily: getFont("bold", isThai) },
              ]}
            >
              {index + 1}
            </Text>
          </View>
          <TextInput
            style={[
              styles.nameInput,
              { fontFamily: getFont("semiBold", isThai) },
            ]}
            value={product.name}
            onChangeText={(text) => updateField("name", text)}
            placeholder={`${t("product")} ${index + 1}`}
            placeholderTextColor={Colors.textMuted}
          />
          <View style={styles.headerActions}>
            {product.notes && (
              <View style={styles.noteIndicator}>
                <Ionicons
                  name="document-text"
                  size={14}
                  color={Colors.primary}
                />
              </View>
            )}
            {canDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                <Ionicons name="close-circle" size={24} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Price and Quantity Row */}
        <View style={styles.mainRow}>
          {/* Price */}
          <View style={[styles.field, styles.priceField]}>
            <Text
              style={[
                styles.fieldLabel,
                { fontFamily: getFont("medium", isThai) },
              ]}
            >
              {t("price")}
            </Text>
            <View style={styles.priceInputWrapper}>
              <Text
                style={[
                  styles.currencySymbol,
                  { fontFamily: getFont("semiBold", isThai) },
                ]}
              >
                {currencySymbol}
              </Text>
              <TextInput
                style={[
                  styles.priceInput,
                  { fontFamily: getFont("regular", isThai) },
                ]}
                value={product.price > 0 ? product.price.toString() : ""}
                onChangeText={(text) =>
                  updateField("price", parseFloat(text) || 0)
                }
                placeholder="0"
                placeholderTextColor={Colors.textMuted}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Quantity */}
          <View style={[styles.field, styles.quantityField]}>
            <View style={styles.quantityLabelRow}>
              <Text
                style={[
                  styles.fieldLabel,
                  { fontFamily: getFont("medium", isThai) },
                ]}
              >
                {t("quantity")}
              </Text>
            </View>
            <View style={styles.quantityRow}>
              <QuantityPicker
                value={product.quantity}
                onSelect={(value) => updateField("quantity", value)}
                min={0}
                max={9999}
              />
              <UnitPicker
                value={product.unit}
                onSelect={(unit) => updateField("unit", unit)}
              />
            </View>
          </View>
        </View>

        {/* Promotion Section */}
        <View style={styles.promotionSection}>
          <TouchableOpacity
            style={styles.promotionButton}
            onPress={onOpenPromotion}
          >
            <Ionicons
              name="pricetag-outline"
              size={18}
              color={Colors.primary}
            />
            <Text
              style={[
                styles.promotionText,
                { fontFamily: getFont("medium", isThai) },
              ]}
            >
              {getPromotionLabel()}
            </Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Dynamic Promotion Inputs */}
        {renderPromotionInputs()}

        {/* Note Button */}
        <TouchableOpacity
          style={styles.noteButton}
          onPress={() => setNoteModalVisible(true)}
        >
          <Ionicons
            name="create-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text
            style={[
              styles.noteButtonText,
              { fontFamily: getFont("medium", isThai) },
            ]}
          >
            {product.notes ? t("editNote") : t("addNote")}
          </Text>
        </TouchableOpacity>
      </AnimatedView>

      <NoteModal
        visible={noteModalVisible}
        onClose={() => setNoteModalVisible(false)}
        onSave={(note) => updateField("notes", note)}
        initialNote={product.notes}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  productNumber: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  productNumberText: {
    fontSize: 14,
    color: Colors.card,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: Spacing.xs,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  noteIndicator: {
    marginRight: Spacing.xs,
  },
  deleteButton: {
    padding: 2,
  },
  mainRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  field: {
    flex: 1,
  },
  priceField: {
    flex: 0.8,
  },
  quantityField: {
    flex: 1.2,
  },
  fieldLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  currencySymbol: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    color: Colors.text,
    fontWeight: "600",
  },
  quantityLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calcButton: {
    padding: Spacing.xs,
  },
  quantityRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  promotionSection: {
    marginBottom: Spacing.md,
  },
  promotionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary + "08",
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary + "20",
    borderStyle: "dashed",
  },
  promotionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  // Promo inputs
  promoInputGroup: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  promoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  promoInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promoInput: {
    flex: 1,
    paddingVertical: Spacing.xs,
    fontSize: 16,
    color: Colors.text,
  },
  promoInputSingle: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
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
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  noteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: Spacing.sm,
  },
  noteButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
});
