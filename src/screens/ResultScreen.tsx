import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, withDelay } from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import { formatPrice, formatPercentage } from '../utils/priceCalculator';
import { useLanguage } from '../hooks/useLanguage';
import { useHistory } from '../hooks/useStorage';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

export function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute<ResultScreenRouteProp>();
  const { t, isThai } = useLanguage();
  const { updateName } = useHistory();
  const { comparison, products } = route.params;

  const [historyName, setHistoryName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const headerOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 400 });
    cardOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    cardScale.value = withDelay(200, withSpring(1, { damping: 15 }));
  }, []);

  const headerStyle = useAnimatedStyle(() => ({ opacity: headerOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const handleShare = async () => {
    const winner = comparison.winner;
    let message = '';
    
    if (comparison.isTie) {
      message = `${t('itsATie')}\n${formatPrice(comparison.winnerResult.pricePerUnit)} ${t('perUnit')}`;
    } else {
      message = `${t('bestDeal')}: ${winner?.name}\n${t('youSave')} ${formatPercentage(comparison.savingsPercentage)}`;
    }
    
    // Add all products
    message += '\n\n' + comparison.allResults.map((r, idx) => 
      `${idx + 1}. ${r.product.name}: ${formatPrice(r.result.pricePerUnit)}/${t('unit')}`
    ).join('\n');
    
    await Share.share({ message, title: t('shareTitle') });
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return Colors.accent;
    if (rank === 2) return Colors.primary;
    return Colors.textMuted;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return 'trophy';
    if (rank === 2) return 'medal';
    return 'ellipse';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={[styles.header, headerStyle]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: getFont('semiBold', isThai) }]}>
            {t('result')}
          </Text>
          <View style={styles.placeholder} />
        </Animated.View>

        {/* Winner Card */}
        <Animated.View style={[styles.winnerCard, cardStyle]}>
          <View style={styles.winnerBadge}>
            <Ionicons name="trophy" size={16} color={Colors.accent} />
            <Text style={[styles.winnerBadgeText, { fontFamily: getFont('bold', isThai) }]}>
              {t('bestDeal') || 'BEST DEAL'}
            </Text>
          </View>

          {!comparison.isTie && comparison.winner && (
            <>
              <Text style={[styles.winnerName, { fontFamily: getFont('bold', isThai) }]}>
                {comparison.winner.name}
              </Text>
              <Text style={[styles.winnerPrice, { fontFamily: getFont('bold', isThai) }]}>
                {formatPrice(comparison.winnerResult.pricePerUnit)}
                <Text style={styles.perUnit}>/{t('unit')}</Text>
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={[styles.savingsText, { fontFamily: getFont('semiBold', isThai) }]}>
                  {t('youSave')} {formatPercentage(comparison.savingsPercentage)}
                </Text>
              </View>
            </>
          )}

          {comparison.isTie && (
            <>
              <Text style={[styles.winnerName, { fontFamily: getFont('bold', isThai) }]}>
                {t('itsATie')}
              </Text>
              <Text style={[styles.tiePrice, { fontFamily: getFont('bold', isThai) }]}>
                {formatPrice(comparison.winnerResult.pricePerUnit)}
                <Text style={styles.perUnit}>/{t('unit')}</Text>
              </Text>
            </>
          )}
        </Animated.View>

        {/* Rankings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: getFont('bold', isThai) }]}>
            {t('rankings') || 'Rankings'}
          </Text>
          
          {comparison.allResults.map(({ product, result, rank }) => (
            <View key={product.id} style={[styles.rankItem, rank === 1 && styles.rankItemWinner]}>
              <View style={[styles.rankNumber, { backgroundColor: getRankColor(rank) + '20' }]}>
                <Ionicons 
                  name={getRankIcon(rank) as any} 
                  size={rank <= 2 ? 16 : 8} 
                  color={getRankColor(rank)} 
                />
              </View>
              <View style={styles.rankInfo}>
                <Text style={[styles.rankName, { fontFamily: getFont('semiBold', isThai) }]}>
                  {product.name}
                </Text>
                <Text style={[styles.rankDetail, { fontFamily: getFont('regular', isThai) }]}>
                  {formatPrice(product.price)} × {product.quantity} {product.unit}
                </Text>
              </View>
              <View style={styles.rankPrice}>
                <Text style={[styles.rankPriceValue, { fontFamily: getFont('bold', isThai), color: getRankColor(rank) }]}>
                  {formatPrice(result.pricePerUnit)}
                </Text>
                <Text style={styles.rankPriceUnit}>/{t('unit')}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: getFont('bold', isThai) }]}>
            {t('comparisonDetails')}
          </Text>
          
          {products.map((product) => (
            <View key={product.id} style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Text style={[styles.detailName, { fontFamily: getFont('semiBold', isThai) }]}>
                  {product.name}
                </Text>
                {product.notes && (
                  <View style={styles.noteIndicator}>
                    <Ionicons name="document-text" size={14} color={Colors.primary} />
                  </View>
                )}
              </View>
              <Text style={[styles.detailText, { fontFamily: getFont('regular', isThai) }]}>
                {t('price')}: {formatPrice(product.price)} • {product.quantity} {product.unit}
              </Text>
              {product.notes && (
                <Text style={[styles.detailNote, { fontFamily: getFont('regular', isThai) }]}>
                  {t('note')}: {product.notes}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={18} color={Colors.text} />
          <Text style={[styles.shareText, { fontFamily: getFont('semiBold', isThai) }]}>
            {t('share')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.newButton} onPress={() => navigation.goBack()}>
          <Text style={[styles.newButtonText, { fontFamily: getFont('semiBold', isThai) }]}>
            {t('newComparison')}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    fontSize: 17,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  winnerCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
    marginBottom: Spacing.lg,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  winnerBadgeText: {
    fontSize: 12,
    color: Colors.accent,
    marginLeft: Spacing.xs,
    letterSpacing: 0.5,
  },
  winnerName: {
    fontSize: 24,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  winnerPrice: {
    fontSize: 36,
    color: Colors.primary,
  },
  tiePrice: {
    fontSize: 32,
    color: Colors.primary,
  },
  perUnit: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  savingsBadge: {
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  savingsText: {
    fontSize: 14,
    color: Colors.accent,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  rankItemWinner: {
    borderWidth: 2,
    borderColor: Colors.accent + '30',
  },
  rankNumber: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rankInfo: {
    flex: 1,
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
  rankPrice: {
    alignItems: 'flex-end',
  },
  rankPriceValue: {
    fontSize: 18,
  },
  rankPriceUnit: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  detailItem: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailName: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  noteIndicator: {
    marginLeft: Spacing.sm,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailNote: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.md,
  },
  shareButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  newButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  newButtonText: {
    fontSize: 16,
    color: Colors.card,
  },
});
