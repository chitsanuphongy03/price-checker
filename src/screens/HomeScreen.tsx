import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  getFont,
} from "../constants/theme";
import { UnitType } from "../constants/units";
import { useLanguage } from "../hooks/useLanguage";
import { useHistory, useSettings } from "../hooks/useStorage";
import { RootStackParamList } from "../navigation/AppNavigator";
import { AppMode, Product, PromotionType } from "../types/promotion";
import {
  compareMultipleProducts,
  validateProduct,
} from "../utils/priceCalculator";
import { PromotionModal } from "../components/PromotionModal";
import { UnitPicker } from "../components/UnitPicker";

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "",
    price: 0,
    quantity: 1,
    unit: "pcs" as UnitType,
    promotion: { type: PromotionType.NONE, value: 0 },
  },
  {
    id: "2",
    name: "",
    price: 0,
    quantity: 1,
    unit: "pcs" as UnitType,
    promotion: { type: PromotionType.NONE, value: 0 },
  },
];

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Main"
>;

// Quick quantity presets


export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { t, isThai } = useLanguage();
  const { settings, refresh: refreshSettings } = useSettings();
  
  // Refresh settings when screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshSettings();
    }, [refreshSettings])
  );
  const { addHistory } = useHistory();

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [mode, setMode] = useState<AppMode>("simple");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [promoModalVisible, setPromoModalVisible] = useState(false);

  // Load settings
  useEffect(() => {
    if (settings) {
      setMode(settings.mode);
    }
  }, [settings]);

  // Calculate results for preview
  const previewResult = useMemo(() => {
    const validProducts = products.filter((p) => validateProduct(p).isValid);
    if (validProducts.length < 2) return null;
    
    const finalProducts = validProducts.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `${t("product")} ${idx + 1}`,
    }));
    
    return compareMultipleProducts(finalProducts);
  }, [products, t]);

  const canCompare = useCallback(() => {
    return products.filter((p) => validateProduct(p).isValid).length >= 2;
  }, [products]);

  const handleCompare = async () => {
    const validProducts = products.filter((p) => validateProduct(p).isValid);
    if (validProducts.length < 2) {
      Alert.alert(
        t("error"),
        t("needAtLeastTwo") || "ต้องมีสินค้าอย่างน้อย 2 รายการ",
      );
      return;
    }

    const finalProducts = validProducts.map((p, idx) => ({
      ...p,
      name: p.name.trim() || `${t("product")} ${idx + 1}`,
    }));

    const comparison = compareMultipleProducts(finalProducts);

    const historyItem = {
      id: Date.now().toString(),
      name: `${t("comparison")} ${new Date().toLocaleDateString()}`,
      timestamp: Date.now(),
      products: finalProducts,
      winner: comparison.winner,
      savingsPercentage: comparison.savingsPercentage,
      mode,
    };
    await addHistory(historyItem);

    navigation.navigate("Result", { comparison, products: finalProducts });
  };

  const handleClear = () => {
    Alert.alert(
      t("clear") || "ล้าง",
      t("confirmClear") || "ล้างข้อมูลทั้งหมด?",
      [
        { text: t("cancel") || "ยกเลิก", style: "cancel" },
        {
          text: t("clear") || "ล้าง",
          style: "destructive",
          onPress: () => {
            setProducts([
              {
                id: "1",
                name: "",
                price: 0,
                quantity: 1,
                unit: "pcs" as UnitType,
                promotion: { type: PromotionType.NONE, value: 0 },
              },
              {
                id: "2",
                name: "",
                price: 0,
                quantity: 1,
                unit: "pcs" as UnitType,
                promotion: { type: PromotionType.NONE, value: 0 },
              },
            ]);
          },
        },
      ],
    );
  };

  const addProduct = () => {
    if (products.length >= 5) {
      Alert.alert(t("limit") || "จำกัด", t("maxProducts") || "เปรียบเทียบได้สูงสุด 5 รายการ");
      return;
    }
    const newId = String(products.length + 1);
    setProducts([
      ...products,
      {
        id: newId,
        name: "",
        price: 0,
        quantity: 1,
        unit: "pcs" as UnitType,
        promotion: { type: PromotionType.NONE, value: 0 },
      },
    ]);
  };

  const removeProduct = (id: string) => {
    if (products.length <= 2) {
      Alert.alert(t("cannotRemove") || "ไม่สามารถลบได้", t("needAtLeastTwo") || "ต้องมีสินค้าอย่างน้อย 2 รายการ");
      return;
    }
    const filtered = products.filter((p) => p.id !== id);
    // Re-index
    const reindexed = filtered.map((p, idx) => ({ ...p, id: String(idx + 1) }));
    setProducts(reindexed);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const handleSelectPromotion = (promotion: { 
    type: PromotionType; 
    value: number; 
    buyX?: number; 
    getY?: number; 
    bundleQuantity?: number 
  }) => {
    if (!activeProductId) return;
    updateProduct(activeProductId, { promotion });
    setPromoModalVisible(false);
    setActiveProductId(null);
  };

  const getPromotionLabel = (product: Product) => {
    const { promotion } = product;
    switch (promotion.type) {
      case PromotionType.PERCENTAGE_DISCOUNT:
        return `${t("discount")} ${promotion.value}%`;
      case PromotionType.FIXED_DISCOUNT:
        return `${t("discount")} ${promotion.value}`;
      case PromotionType.BUY_X_GET_Y:
        return `ซื้อ ${promotion.buyX || 2} แถม ${promotion.getY || 1}`;
      case PromotionType.BUNDLE_PRICE:
        return `${promotion.bundleQuantity || 3} ชิ้น ${promotion.value}`;
      default:
        return t("noPromotion");
    }
  };

  const activeProduct = activeProductId
    ? products.find((p) => p.id === activeProductId)
    : null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { fontFamily: getFont("bold", isThai) }]}>
              {t("appName")}
            </Text>
            <Text style={[styles.subtitle, { fontFamily: getFont("regular", isThai) }]}>
              {t("appSubtitle")}
            </Text>
          </View>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Ionicons name="refresh-outline" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Product Cards */}
          {products.map((product, index) => (
            <Animated.View 
              key={product.id}
              entering={FadeInUp.delay(index * 100)}
              style={styles.card}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.productBadge}>
                  <Text style={[styles.productBadgeText, { fontFamily: getFont("bold", isThai) }]}>
                    {index + 1}
                  </Text>
                </View>
                <TextInput
                  style={[styles.nameInput, { fontFamily: getFont("medium", isThai) }]}
                  value={product.name}
                  onChangeText={(text) => updateProduct(product.id, { name: text })}
                  placeholder={`${t("product")} ${index + 1}`}
                  placeholderTextColor={Colors.textMuted}
                />
                {products.length > 2 && (
                  <TouchableOpacity 
                    onPress={() => removeProduct(product.id)}
                    style={styles.removeBtn}
                  >
                    <Ionicons name="close-circle" size={24} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Price & Quantity Row */}
              <View style={styles.inputRow}>
                {/* Price */}
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={[styles.inputLabel, { fontFamily: getFont("medium", isThai) }]}>
                    {t("price")}
                  </Text>
                  <View style={styles.priceInputWrapper}>
                    <Text style={styles.currency}>{settings?.currency || '฿'}</Text>
                    <TextInput
                      style={[styles.priceInput, { fontFamily: getFont("bold", isThai) }]}
                      value={product.price > 0 ? product.price.toString() : ""}
                      onChangeText={(text) =>
                        updateProduct(product.id, { price: parseFloat(text) || 0 })
                      }
                      placeholder="0"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* Quantity */}
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={[styles.inputLabel, { fontFamily: getFont("medium", isThai) }]}>
                    {t("quantity")}
                  </Text>
                  <TextInput
                    style={[styles.quantityInput, { fontFamily: getFont("bold", isThai) }]}
                    value={product.quantity > 0 ? product.quantity.toString() : ""}
                    onChangeText={(text) =>
                      updateProduct(product.id, { quantity: parseFloat(text) || 0 })
                    }
                    placeholder="1"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="decimal-pad"
                  />
                </View>

                {/* Unit */}
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { fontFamily: getFont("medium", isThai) }]}>
                    {t("unit")}
                  </Text>
                  <UnitPicker
                    value={product.unit}
                    onSelect={(unit) => updateProduct(product.id, { unit })}
                  />
                </View>
              </View>

              {/* Price per Unit Display */}
              {product.price > 0 && product.quantity > 0 && (
                <View style={styles.pricePerUnitBox}>
                  <Text style={[styles.pricePerUnitLabel, { fontFamily: getFont("medium", isThai) }]}>
                    {t("pricePerUnit")}
                  </Text>
                  <Text style={[styles.pricePerUnitValue, { fontFamily: getFont("bold", isThai) }]}>
                    {settings?.currency || '฿'}{(product.price / product.quantity).toFixed(2)}
                    <Text style={styles.pricePerUnitUnit}>/{product.unit}</Text>
                  </Text>
                </View>
              )}

              {/* Promotion Button */}
              <TouchableOpacity
                style={styles.promoBtn}
                onPress={() => {
                  setActiveProductId(product.id);
                  setPromoModalVisible(true);
                }}
              >
                <Ionicons 
                  name={product.promotion.type === PromotionType.NONE ? "pricetag-outline" : "pricetag"} 
                  size={18} 
                  color={product.promotion.type === PromotionType.NONE ? Colors.textMuted : Colors.success} 
                />
                <Text
                  style={[
                    styles.promoText,
                    { fontFamily: getFont("medium", isThai) },
                    product.promotion.type !== PromotionType.NONE && styles.promoTextActive,
                  ]}
                >
                  {getPromotionLabel(product)}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Add Product Button */}
          {products.length < 5 && (
            <Animated.View entering={FadeIn}>
              <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
                <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                <Text style={[styles.addBtnText, { fontFamily: getFont("semiBold", isThai) }]}>
                  {t("addProduct")}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Live Result Preview */}
          {previewResult && previewResult.winner && (
            <Animated.View entering={FadeInUp} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="trophy" size={24} color={Colors.warning} />
                <Text style={[styles.resultTitle, { fontFamily: getFont("bold", isThai) }]}>
                  {t("bestDeal")}
                </Text>
              </View>
              
              <View style={styles.resultContent}>
                <Text style={[styles.winnerName, { fontFamily: getFont("bold", isThai) }]}>
                  {previewResult.winner.name?.match(/\d+/)?.[0] 
                    ? `${t("product")} ${previewResult.winner.name.match(/\d+/)?.[0]}` 
                    : previewResult.winner.name}
                </Text>
                
                <View style={styles.savingsRow}>
                  <Text style={[styles.savingsLabel, { fontFamily: getFont("regular", isThai) }]}>
                    {t("youSave")}
                  </Text>
                  <Text style={[styles.savingsValue, { fontFamily: getFont("bold", isThai) }]}>
                    {previewResult.savingsPercentage.toFixed(0)}%
                  </Text>
                </View>

                <View style={styles.priceCompareRow}>
                  <View style={styles.priceItem}>
                    <Text style={[styles.priceLabel, { fontFamily: getFont("regular", isThai) }]}>
                      {previewResult.winner.name?.match(/\d+/)?.[0] 
                        ? `${t("product")} ${previewResult.winner.name.match(/\d+/)?.[0]}` 
                        : t("best")}
                    </Text>
                    <Text style={[styles.priceValue, { fontFamily: getFont("bold", isThai) }]}>
                      {settings?.currency || '฿'}{previewResult.winnerResult.pricePerUnit.toFixed(2)}
                    </Text>
                    <Text style={[styles.priceUnit, { fontFamily: getFont("regular", isThai) }]}>
                      /{t("unit")}
                    </Text>
                  </View>
                  
                  <View style={styles.vsBadge}>
                    <Text style={[styles.vsText, { fontFamily: getFont("bold", isThai) }]}>VS</Text>
                  </View>
                  
                  <View style={styles.priceItem}>
                    <Text style={[styles.priceLabel, { fontFamily: getFont("regular", isThai) }]}>
                      {previewResult.loser?.name?.match(/\d+/)?.[0] 
                        ? `${t("product")} ${previewResult.loser.name.match(/\d+/)?.[0]}` 
                        : t("other")}
                    </Text>
                    <Text style={[styles.priceValueLoser, { fontFamily: getFont("bold", isThai) }]}>
                      {settings?.currency || '฿'}{previewResult.loserResult.pricePerUnit.toFixed(2)}
                    </Text>
                    <Text style={[styles.priceUnit, { fontFamily: getFont("regular", isThai) }]}>
                      /{t("unit")}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Bottom Compare Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.compareBtn,
              !canCompare() && styles.compareBtnDisabled,
            ]}
            onPress={handleCompare}
            disabled={!canCompare()}
          >
            <Ionicons name="bar-chart" size={20} color={Colors.card} />
            <Text style={[styles.compareBtnText, { fontFamily: getFont("bold", isThai) }]}>
              {t("compare")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <PromotionModal
          visible={promoModalVisible}
          onClose={() => {
            setPromoModalVisible(false);
            setActiveProductId(null);
          }}
          onSelect={handleSelectPromotion}
          currentPromotion={activeProduct?.promotion || { type: PromotionType.NONE, value: 0 }}
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: 22,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  clearBtn: {
    padding: Spacing.sm,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  productBadge: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  productBadgeText: {
    fontSize: 14,
    color: Colors.card,
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: Spacing.xs,
  },
  removeBtn: {
    marginLeft: Spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    minWidth: 70,
  },
  flex1: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  currency: {
    fontSize: 16,
    color: Colors.textMuted,
    marginRight: Spacing.xs,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    color: Colors.text,
  },
  quantityInput: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: 18,
    color: Colors.text,
    textAlign: "center",
  },
  pricePerUnitBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary + "10",
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  pricePerUnitLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  pricePerUnitValue: {
    fontSize: 16,
    color: Colors.primary,
  },
  pricePerUnitUnit: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  promoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  promoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  promoTextActive: {
    color: Colors.success,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary + "30",
    borderStyle: "dashed",
  },
  addBtnText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  resultCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.warning + "30",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  resultTitle: {
    fontSize: 18,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  resultContent: {
    alignItems: "center",
  },
  winnerName: {
    fontSize: 20,
    color: Colors.success,
    marginBottom: Spacing.sm,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  savingsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: Spacing.xs,
  },
  savingsValue: {
    fontSize: 24,
    color: Colors.success,
  },
  priceCompareRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: Spacing.md,
  },
  priceItem: {
    alignItems: "center",
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  priceValue: {
    fontSize: 20,
    color: Colors.success,
  },
  priceValueLoser: {
    fontSize: 20,
    color: Colors.text,
  },
  priceUnit: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  vsBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.divider,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: Spacing.md,
  },
  vsText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Platform.OS === "ios" ? Spacing.xl : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    ...Shadows.lg,
  },
  compareBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  compareBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  compareBtnText: {
    fontSize: 16,
    color: Colors.card,
  },
});
