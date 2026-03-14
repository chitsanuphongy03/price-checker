import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  getFont,
} from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";
import { useSettings } from "../hooks/useStorage";
import { RootStackParamList } from "../navigation/AppNavigator";
import { HistoryItem } from "../types/promotion";
import { formatPrice } from "../utils/priceCalculator";
import { getHistory } from "../utils/storage";

type HistoryDetailRouteProp = RouteProp<RootStackParamList, "HistoryDetail">;

export function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<HistoryDetailRouteProp>();
  const { t, isThai } = useLanguage();
  const { settings } = useSettings();
  const currency = settings?.currency || '฿';
  const { historyId } = route.params;

  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null);

  const loadHistory = useCallback(async () => {
    const history = await getHistory();
    const item = history.find((h) => h.id === historyId);
    if (item) {
      setHistoryItem(item);
    }
  }, [historyId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleShare = async () => {
    if (!historyItem) return;

    const message =
      `${t("comparison")}: ${historyItem.name}\n` +
      `${t("date")}: ${new Date(historyItem.timestamp).toLocaleDateString()}\n\n` +
      historyItem.products
        .map((p, idx) => `${idx + 1}. ${p.name}: ${formatPrice(p.price, currency)}`)
        .join("\n");

    await Share.share({ message });
  };

  if (!historyItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Ionicons name="time-outline" size={48} color={Colors.textMuted} />
          <Text style={[styles.loadingText, { fontFamily: getFont("medium", isThai) }]}>
            {t("loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { fontFamily: getFont("bold", isThai) },
          ]}
        >
          {t("historyDetail")}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Summary Card */}
        <Animated.View entering={FadeInUp} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
            <Text
              style={[
                styles.summaryDate,
                { fontFamily: getFont("regular", isThai) },
              ]}
            >
              {new Date(historyItem.timestamp).toLocaleDateString()} • {new Date(historyItem.timestamp).toLocaleTimeString()}
            </Text>
          </View>
          
          <Text style={[styles.summaryTitle, { fontFamily: getFont("bold", isThai) }]}>
            {historyItem.name}
          </Text>

          {historyItem.winner && (
            <View style={styles.winnerBox}>
              <View style={styles.winnerHeader}>
                <Ionicons name="trophy" size={20} color={Colors.warning} />
                <Text
                  style={[
                    styles.winnerLabel,
                    { fontFamily: getFont("bold", isThai) },
                  ]}
                >
                  {t("bestDeal")}
                </Text>
              </View>
              <Text
                style={[
                  styles.winnerName,
                  { fontFamily: getFont("bold", isThai) },
                ]}
              >
                {historyItem.winner.name}
              </Text>
              <View style={styles.savingsRow}>
                <Ionicons name="trending-down" size={16} color={Colors.success} />
                <Text
                  style={[
                    styles.savingsText,
                    { fontFamily: getFont("semiBold", isThai) },
                  ]}
                >
                  {t("youSave")} {historyItem.savingsPercentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Products Section */}
        <Animated.View entering={FadeInUp.delay(100)}>
          <Text
            style={[styles.sectionTitle, { fontFamily: getFont("bold", isThai) }]}
          >
            {t("products")} ({historyItem.products.length})
          </Text>

          {historyItem.products.map((product, idx) => (
            <View
              key={product.id}
              style={[
                styles.productCard,
                historyItem.winner?.id === product.id && styles.productCardWinner,
              ]}
            >
              {/* Product Header */}
              <View style={styles.productHeader}>
                <View style={[
                  styles.productBadge,
                  historyItem.winner?.id === product.id && styles.productBadgeWinner,
                ]}>
                  {historyItem.winner?.id === product.id ? (
                    <Ionicons name="trophy" size={14} color={Colors.card} />
                  ) : (
                    <Text
                      style={[
                        styles.productBadgeText,
                        { fontFamily: getFont("bold", isThai) },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.productName,
                    { fontFamily: getFont("semiBold", isThai) },
                  ]}
                  numberOfLines={1}
                >
                  {product.name}
                </Text>
                {historyItem.winner?.id === product.id && (
                  <View style={styles.bestBadge}>
                    <Text
                      style={[
                        styles.bestBadgeText,
                        { fontFamily: getFont("bold", isThai) },
                      ]}
                    >
                      {t("best")}
                    </Text>
                  </View>
                )}
              </View>

              {/* Product Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t("price")}</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { fontFamily: getFont("bold", isThai) },
                    ]}
                  >
                    {formatPrice(product.price, currency)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t("quantity")}</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { fontFamily: getFont("bold", isThai) },
                    ]}
                  >
                    {product.quantity}
                  </Text>
                  <Text style={styles.detailUnit}>{product.unit}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t("pricePerUnit")}</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      styles.detailValuePrimary,
                      { fontFamily: getFont("bold", isThai) },
                    ]}
                  >
                    {currency}{(product.price / product.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Total Price */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t("total")}</Text>
                <Text
                  style={[
                    styles.totalValue,
                    { fontFamily: getFont("bold", isThai) },
                  ]}
                >
                  {formatPrice(product.price * product.quantity, currency)}
                </Text>
              </View>

              {/* Notes */}
              {product.notes && (
                <View style={styles.noteBox}>
                  <Ionicons name="create-outline" size={14} color={Colors.textMuted} />
                  <Text
                    style={[
                      styles.noteText,
                      { fontFamily: getFont("regular", isThai) },
                    ]}
                  >
                    {product.notes}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.text,
  },
  shareButton: {
    padding: Spacing.sm,
  },
  content: {
    padding: Spacing.lg,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  summaryDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  summaryTitle: {
    fontSize: 22,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  winnerBox: {
    backgroundColor: Colors.success + "10",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  winnerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  winnerLabel: {
    fontSize: 14,
    color: Colors.success,
    marginLeft: Spacing.xs,
  },
  winnerName: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  savingsText: {
    fontSize: 14,
    color: Colors.success,
    marginLeft: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  productCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  productCardWinner: {
    borderWidth: 2,
    borderColor: Colors.success + "30",
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  productBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  productBadgeWinner: {
    backgroundColor: Colors.success,
  },
  productBadgeText: {
    fontSize: 14,
    color: Colors.card,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  bestBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing.xs,
  },
  bestBadgeText: {
    fontSize: 10,
    color: Colors.card,
  },
  detailsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailItem: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.text,
  },
  detailValuePrimary: {
    color: Colors.primary,
  },
  detailUnit: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    color: Colors.text,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  bottomSpacer: {
    height: 40,
  },
});
