import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { BorderRadius, Colors, Shadows, Spacing } from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";
import { ComparisonResult } from "../types/promotion";
import { formatPercentage, formatPrice } from "../utils/priceCalculator";

interface ResultCardProps {
  comparison: ComparisonResult;
}

export function ResultCard({ comparison }: ResultCardProps) {
  const { t } = useLanguage();
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);
  const trophyScale = useSharedValue(0);
  const savingsScale = useSharedValue(0);

  useEffect(() => {
    // Entrance animation sequence
    cardOpacity.value = withTiming(1, { duration: 400 });
    cardScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, { damping: 12, stiffness: 150 }),
    );

    // Trophy pop animation
    trophyScale.value = withDelay(
      300,
      withSpring(1, { damping: 10, stiffness: 200 }),
    );

    // Savings badge animation
    savingsScale.value = withDelay(
      500,
      withSpring(1, { damping: 12, stiffness: 150 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const trophyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
    opacity: trophyScale.value,
  }));

  const savingsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: savingsScale.value }],
    opacity: savingsScale.value,
  }));

  if (comparison.isTie) {
    return (
      <Animated.View style={[styles.container, cardAnimatedStyle]}>
        <View style={styles.tieContainer}>
          <Animated.Text style={[styles.tieEmoji, trophyAnimatedStyle]}>
            ⚖️
          </Animated.Text>
          <Text style={styles.tieTitle}>{t("itsATie")}</Text>
          <Text style={styles.tieSubtitle}>{t("tieMessage")}</Text>
          <Text style={styles.tiePrice}>
            {formatPrice(comparison.winnerResult.pricePerUnit)} {t("perUnit")}
          </Text>
        </View>
      </Animated.View>
    );
  }

  const winner = comparison.winner!;
  const winnerResult = comparison.winnerResult;
  const loserResult = comparison.loserResult;

  return (
    <Animated.View style={[styles.container, cardAnimatedStyle]}>
      {/* Trophy Icon */}
      <View style={styles.trophyContainer}>
        <Animated.View style={[styles.trophyCircle, trophyAnimatedStyle]}>
          <Text style={styles.trophyEmoji}>🏆</Text>
        </Animated.View>
        <Text style={styles.bestDealLabel}>{t("bestDeal")}</Text>
      </View>

      {/* Winner Info */}
      <View style={styles.winnerInfo}>
        <Text style={styles.winnerName}>{winner.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.pricePerUnit}>
            {formatPrice(winnerResult.pricePerUnit)}
          </Text>
          <Text style={styles.perUnitLabel}> {t("perUnit")}</Text>
        </View>
      </View>

      {/* Savings Badge */}
      <Animated.View style={[styles.savingsContainer, savingsAnimatedStyle]}>
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsEmoji}>💰</Text>
          <Text style={styles.savingsText}>
            {t("youSave")} {formatPercentage(comparison.savingsPercentage)}
          </Text>
        </View>
      </Animated.View>

      {/* Comparison Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("originalTotal")}</Text>
          <Text style={styles.detailValue}>
            {formatPrice(winnerResult.originalTotal)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t("afterPromotion")}</Text>
          <Text style={[styles.detailValue, styles.promotionValue]}>
            {formatPrice(winnerResult.totalPrice)}
          </Text>
        </View>
        {winnerResult.savingsAmount > 0 && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t("youSaveAmount")}</Text>
            <Text style={[styles.detailValue, styles.savingsValue]}>
              {formatPrice(winnerResult.savingsAmount)}
            </Text>
          </View>
        )}
        <View style={[styles.detailRow, styles.totalRow]}>
          <Text style={[styles.detailLabel, styles.totalLabel]}>
            {t("pricePerUnit")}
          </Text>
          <Text style={[styles.detailValue, styles.totalValue]}>
            {formatPrice(winnerResult.pricePerUnit)}
          </Text>
        </View>
      </View>

      {/* Alternative Info */}
      <View style={styles.alternativeContainer}>
        <Text style={styles.alternativeLabel}>{t("vsAlternative")}</Text>
        <Text style={styles.alternativePrice}>
          {formatPrice(loserResult.pricePerUnit)} /{" "}
          {t("perUnit").replace("/ ", "")}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.md,
    ...Shadows.lg,
  },
  trophyContainer: {
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accent + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  trophyEmoji: {
    fontSize: 40,
  },
  bestDealLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  winnerInfo: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  winnerName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  pricePerUnit: {
    fontSize: 42,
    fontWeight: "800",
    color: Colors.primary,
  },
  perUnitLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  savingsContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  savingsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent + "20",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  savingsEmoji: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  savingsText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.accentDark,
  },
  detailsContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  promotionValue: {
    color: Colors.primary,
  },
  savingsValue: {
    color: Colors.accent,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  totalLabel: {
    fontWeight: "700",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primary,
  },
  alternativeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
  },
  alternativeLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  alternativePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  // Tie styles
  tieContainer: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },
  tieEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  tieTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tieSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  tiePrice: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
});
