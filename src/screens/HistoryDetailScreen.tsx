import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';
import { HistoryItem } from '../types/promotion';
import { formatPrice } from '../utils/priceCalculator';
import { getHistory } from '../utils/storage';
import { useLanguage } from '../hooks/useLanguage';

type HistoryDetailRouteProp = RouteProp<RootStackParamList, 'HistoryDetail'>;

export function HistoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<HistoryDetailRouteProp>();
  const { t, isThai } = useLanguage();
  const { historyId } = route.params;
  
  const [historyItem, setHistoryItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    loadHistory();
  }, [historyId]);

  const loadHistory = async () => {
    const history = await getHistory();
    const item = history.find(h => h.id === historyId);
    if (item) {
      setHistoryItem(item);
    }
  };

  const handleShare = async () => {
    if (!historyItem) return;
    
    const message = `${t('comparison')}: ${historyItem.name}\n` +
      `${t('date')}: ${new Date(historyItem.timestamp).toLocaleDateString()}\n\n` +
      historyItem.products.map((p, idx) => 
        `${idx + 1}. ${p.name}: ${formatPrice(p.price)}`
      ).join('\n');
    
    await Share.share({ message });
  };

  if (!historyItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text>{t('loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontFamily: getFont('semiBold', isThai) }]}>
          {t('historyDetail')}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Title Card */}
        <View style={styles.titleCard}>
          <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
            {historyItem.name}
          </Text>
          <Text style={[styles.date, { fontFamily: getFont('regular', isThai) }]}>
            {new Date(historyItem.timestamp).toLocaleString()}
          </Text>
          {historyItem.winner && (
            <View style={styles.winnerBadge}>
              <Ionicons name="trophy" size={14} color={Colors.accent} />
              <Text style={[styles.winnerText, { fontFamily: getFont('semiBold', isThai) }]}>
                {t('bestDeal')}: {historyItem.winner.name}
              </Text>
            </View>
          )}
        </View>

        {/* Products */}
        <Text style={[styles.sectionTitle, { fontFamily: getFont('bold', isThai) }]}>
          {t('products')}
        </Text>
        
        {historyItem.products.map((product, idx) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <View style={styles.productNumber}>
                <Text style={[styles.productNumberText, { fontFamily: getFont('bold', isThai) }]}>
                  {idx + 1}
                </Text>
              </View>
              <Text style={[styles.productName, { fontFamily: getFont('semiBold', isThai) }]}>
                {product.name}
              </Text>
            </View>
            
            <View style={styles.productDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { fontFamily: getFont('medium', isThai) }]}>
                  {t('price')}
                </Text>
                <Text style={[styles.detailValue, { fontFamily: getFont('regular', isThai) }]}>
                  {formatPrice(product.price)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { fontFamily: getFont('medium', isThai) }]}>
                  {t('quantity')}
                </Text>
                <Text style={[styles.detailValue, { fontFamily: getFont('regular', isThai) }]}>
                  {product.quantity} {product.unit}
                </Text>
              </View>
              {product.notes && (
                <View style={styles.noteBox}>
                  <Ionicons name="document-text" size={14} color={Colors.primary} />
                  <Text style={[styles.noteText, { fontFamily: getFont('regular', isThai) }]}>
                    {product.notes}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    fontSize: 17,
    color: Colors.text,
  },
  shareButton: {
    padding: Spacing.sm,
  },
  content: {
    padding: Spacing.lg,
  },
  titleCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  title: {
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  winnerText: {
    fontSize: 14,
    color: Colors.accent,
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
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  productNumber: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  productNumberText: {
    fontSize: 14,
    color: Colors.card,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  productDetails: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
});
