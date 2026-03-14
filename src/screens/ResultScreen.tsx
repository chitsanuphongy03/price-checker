import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import {
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
} from "react-native-reanimated";
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
import { formatPercentage, formatPrice } from "../utils/priceCalculator";

type ResultScreenRouteProp = RouteProp<RootStackParamList, "Result">;

export function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute<ResultScreenRouteProp>();
  const { t, isThai } = useLanguage();
  const { settings } = useSettings();
  const currency = settings?.currency || '฿';
  const { comparison, products } = route.params;

  const handleShare = async () => {
    const winner = comparison.winner;
    let message = "";

    if (comparison.isTie) {
      message = `${t("itsATie")}\n${formatPrice(comparison.winnerResult.pricePerUnit, currency)} ${t("perUnit")}`;
    } else {
      message = `${t("bestDeal")}: ${winner?.name}\n${t("youSave")} ${formatPercentage(comparison.savingsPercentage)}`;
    }

    message +=
      "\n\n" +
      comparison.allResults
        .map(
          (r, idx) =>
            `${idx + 1}. ${r.product.name}: ${formatPrice(r.result.pricePerUnit, currency)}/${t("unit")}`,
        )
        .join("\n");

    await Share.share({ message, title: t("shareTitle") });
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return Colors.success;
    if (rank === 2) return Colors.warning;
    return Colors.textMuted;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "trophy";
    if (rank === 2) return "medal-outline";
    return "ellipse";
  };

  // Calculate savings
  const winnerResult = comparison.allResults[0];
  const loserResult = comparison.allResults[comparison.allResults.length - 1];
  const savingsAmount = comparison.isTie ? 0 : (loserResult.result.pricePerUnit - winnerResult.result.pricePerUnit);
  const savingsPercent = comparison.savingsPercentage;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
            {t("result")}
          </Text>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Winner Card */}
        <Animated.View entering={FadeInUp} style={styles.winnerCard}>
          <View style={styles.winnerHeader}>
            <Ionicons name="trophy" size={28} color={Colors.warning} />
            <Text
              style={[
                styles.winnerTitle,
                { fontFamily: getFont("bold", isThai) },
              ]}
            >
              {t("bestDeal")}
            </Text>
          </View>

          {!comparison.isTie && comparison.winner && (
            <>
              <Text
                style={[
                  styles.winnerName,
                  { fontFamily: getFont("bold", isThai) },
                ]}
              >
                {comparison.winner.name}
              </Text>
              
              <View style={styles.winnerPriceBox}>
                <Text style={styles.pricePrefix}>{currency}</Text>
                <Text
                  style={[
                    styles.winnerPrice,
                    { fontFamily: getFont("bold", isThai) },
                  ]}
                >
                  {winnerResult.result.pricePerUnit.toFixed(2)}
                </Text>
                <Text style={styles.priceSuffix}>/{t("unit")}</Text>
              </View>

              <View style={styles.savingsBox}>
                <View style={styles.savingsRow}>
                  <Ionicons name="trending-down" size={18} color={Colors.success} />
                  <Text
                    style={[
                      styles.savingsText,
                      { fontFamily: getFont("semiBold", isThai) },
                    ]}
                  >
                    {t("youSave")} {formatPercentage(savingsPercent)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.savingsSubtext,
                    { fontFamily: getFont("regular", isThai) },
                  ]}
                >
                  ({currency}{savingsAmount.toFixed(2)} /{t("unit")})
                </Text>
              </View>
            </>
          )}

          {comparison.isTie && (
            <>
              <Text
                style={[
                  styles.tieText,
                  { fontFamily: getFont("medium", isThai) },
                ]}
              >
                {t("itsATie")}
              </Text>
              <View style={styles.winnerPriceBox}>
                <Text style={styles.pricePrefix}>{currency}</Text>
                <Text
                  style={[
                    styles.winnerPrice,
                    { fontFamily: getFont("bold", isThai) },
                  ]}
                >
                  {comparison.winnerResult.pricePerUnit.toFixed(2)}
                </Text>
                <Text style={styles.priceSuffix}>/{t("unit")}</Text>
              </View>
              <Text style={styles.tieSubtext}>{t("tieMessage")}</Text>
            </>
          )}
        </Animated.View>

        {/* Comparison Summary */}
        {!comparison.isTie && (
          <Animated.View entering={FadeInUp.delay(100)} style={styles.compareCard}>
            <Text
              style={[
                styles.compareTitle,
                { fontFamily: getFont("bold", isThai) },
              ]}
            >
              {t("priceCompare") || "เปรียบเทียบราคา"}
            </Text>
            
            <View style={styles.compareRow}>
              <View style={styles.compareItem}>
                <View style={[styles.rankBadge, { backgroundColor: Colors.success + '20' }]}>
                  <Ionicons name="trophy" size={14} color={Colors.success} />
                </View>
                <Text
                  style={[
                    styles.compareName,
                    { fontFamily: getFont("medium", isThai) },
                  ]}
                >
                  {winnerResult.product.name}
                </Text>
                <Text
                  style={[
                    styles.comparePrice,
                    { fontFamily: getFont("bold", isThai), color: Colors.success },
                  ]}
                >
                  {currency}{winnerResult.result.pricePerUnit.toFixed(2)}
                </Text>
              </View>

              <View style={styles.vsBadge}>
                <Text style={[styles.vsText, { fontFamily: getFont("bold", isThai) }]}>VS</Text>
              </View>

              <View style={styles.compareItem}>
                <View style={[styles.rankBadge, { backgroundColor: Colors.textMuted + '20' }]}>
                  <Text style={[styles.rankNumber, { color: Colors.textMuted }]}>#2</Text>
                </View>
                <Text
                  style={[
                    styles.compareName,
                    { fontFamily: getFont("medium", isThai) },
                  ]}
                >
                  {loserResult.product.name}
                </Text>
                <Text
                  style={[
                    styles.comparePrice,
                    { fontFamily: getFont("bold", isThai), color: Colors.text },
                  ]}
                >
                  {currency}{loserResult.result.pricePerUnit.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.savingsCalc}>
              <Text
                style={[
                  styles.savingsCalcText,
                  { fontFamily: getFont("medium", isThai) },
                ]}
              >
                {t("perUnitDiff") || "ต่างกัน"} {currency}{savingsAmount.toFixed(2)}/{t("unit")} ({formatPercentage(savingsPercent)})
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Rankings List */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { fontFamily: getFont("bold", isThai) },
            ]}
          >
            {t("rankings") || "อันดับ"}
          </Text>

          {comparison.allResults.map(({ product, result, rank }) => (
            <View
              key={product.id}
              style={[
                styles.rankItem,
                rank === 1 && styles.rankItemWinner,
              ]}
            >
              <View
                style={[
                  styles.rankBadge,
                  { backgroundColor: getRankColor(rank) + "20" },
                ]}
              >
                {rank <= 2 ? (
                  <Ionicons
                    name={getRankIcon(rank) as any}
                    size={16}
                    color={getRankColor(rank)}
                  />
                ) : (
                  <Text style={[styles.rankNumber, { color: getRankColor(rank) }]}>
                    {rank}
                  </Text>
                )}
              </View>
              
              <View style={styles.rankInfo}>
                <Text
                  style={[
                    styles.rankName,
                    { fontFamily: getFont("semiBold", isThai) },
                  ]}
                >
                  {product.name}
                </Text>
                <Text
                  style={[
                    styles.rankDetail,
                    { fontFamily: getFont("regular", isThai) },
                  ]}
                >
                  {formatPrice(product.price, currency)} × {product.quantity} {product.unit}
                </Text>
              </View>
              
              <View style={styles.rankPriceBox}>
                <Text
                  style={[
                    styles.rankPriceValue,
                    {
                      fontFamily: getFont("bold", isThai),
                      color: getRankColor(rank),
                    },
                  ]}
                >
                  {currency}{result.pricePerUnit.toFixed(2)}
                </Text>
                <Text style={styles.rankPriceUnit}>/{t("unit")}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Product Details */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { fontFamily: getFont("bold", isThai) },
            ]}
          >
            {t("productDetails") || "รายละเอียดสินค้า"}
          </Text>

          {products.map((product) => (
            <View key={product.id} style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text
                  style={[
                    styles.detailName,
                    { fontFamily: getFont("semiBold", isThai) },
                  ]}
                >
                  {product.name}
                </Text>
                {product.notes && (
                  <Ionicons name="document-text" size={16} color={Colors.primary} />
                )}
              </View>
              
              <View style={styles.detailGrid}>
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
                    {product.quantity} {product.unit}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t("total")}</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { fontFamily: getFont("bold", isThai) },
                    ]}
                  >
                    {formatPrice(product.price * product.quantity, currency)}
                  </Text>
                </View>
              </View>
              
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

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="refresh" size={20} color={Colors.card} />
          <Text
            style={[
              styles.newButtonText,
              { fontFamily: getFont("bold", isThai) },
            ]}
          >
            {t("newComparison")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.text,
  },
  shareBtn: {
    padding: Spacing.sm,
  },
  winnerCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: "center",
    ...Shadows.md,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.warning + "30",
  },
  winnerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  winnerTitle: {
    fontSize: 18,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  winnerName: {
    fontSize: 22,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  winnerPriceBox: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  pricePrefix: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: "600",
  },
  winnerPrice: {
    fontSize: 48,
    color: Colors.primary,
  },
  priceSuffix: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  savingsBox: {
    backgroundColor: Colors.success + "15",
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  savingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  savingsText: {
    fontSize: 16,
    color: Colors.success,
  },
  savingsSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  tieText: {
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tieSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  compareCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  compareTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  compareRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  compareItem: {
    flex: 1,
    alignItems: "center",
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  compareName: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  comparePrice: {
    fontSize: 18,
  },
  vsBadge: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.divider,
    justifyContent: "center",
    alignItems: "center",
  },
  vsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  savingsCalc: {
    backgroundColor: Colors.success + "10",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  savingsCalcText: {
    fontSize: 14,
    color: Colors.success,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  rankItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  rankItemWinner: {
    borderWidth: 2,
    borderColor: Colors.success + "30",
  },
  rankInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  rankName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 2,
  },
  rankDetail: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  rankPriceBox: {
    alignItems: "flex-end",
  },
  rankPriceValue: {
    fontSize: 18,
  },
  rankPriceUnit: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  detailCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  detailName: {
    fontSize: 16,
    color: Colors.text,
  },
  detailGrid: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.text,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  bottomSpacer: {
    height: 80,
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
  newButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  newButtonText: {
    fontSize: 16,
    color: Colors.card,
  },
});
