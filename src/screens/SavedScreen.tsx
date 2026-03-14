import { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { useLanguage } from '../hooks/useLanguage';
import { useHistory } from '../hooks/useStorage';
import { HistoryItem } from '../types/promotion';
import { formatPrice } from '../utils/priceCalculator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SavedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function SavedScreen() {
  const { t, isThai } = useLanguage();
  const navigation = useNavigation<SavedScreenNavigationProp>();
  const { history, toggleSaved, refresh } = useHistory();

  const savedItems = history.filter(item => item.isSaved);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleUnsave = async (id: string) => {
    await toggleSaved(id);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.savedItem}
      onPress={() => navigation.navigate("HistoryDetail", { historyId: item.id })}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Ionicons name="heart" size={18} color={Colors.error} />
          <Text
            style={[
              styles.itemName,
              { fontFamily: getFont("semiBold", isThai) },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
        <Text
          style={[
            styles.itemDate,
            { fontFamily: getFont("regular", isThai) },
          ]}
        >
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        {item.winner && (
          <View style={styles.winnerRow}>
            <Ionicons name="trophy" size={12} color={Colors.warning} />
            <Text
              style={[
                styles.winnerText,
                { fontFamily: getFont("medium", isThai), color: Colors.success },
              ]}
            >
              {item.winner.name}
            </Text>
            <Text
              style={[
                styles.savingsText,
                { fontFamily: getFont("regular", isThai) },
              ]}
            >
              {t("saved")} {formatPrice(item.winner.price)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.unsaveButton}
        onPress={() => handleUnsave(item.id)}
      >
        <Ionicons name="heart-dislike-outline" size={20} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
          {t('favorites') || 'รายการโปรด'}
        </Text>
        <View style={styles.savedCount}>
          <Ionicons name="heart" size={16} color={Colors.error} />
          <Text style={[styles.countText, { fontFamily: getFont('bold', isThai) }]}>
            {savedItems.length}
          </Text>
        </View>
      </View>

      {savedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={Colors.textMuted} />
          <Text style={[styles.emptyTitle, { fontFamily: getFont('bold', isThai) }]}>
            {t('noSaved') || 'ยังไม่มีรายการบันทึก'}
          </Text>
          <Text style={[styles.emptySubtitle, { fontFamily: getFont('regular', isThai) }]}>
            {t('tapHeartToSave') || 'แตะไอคอนหัวใจในประวัติเพื่อบันทึก'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    color: Colors.text,
  },
  savedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  countText: {
    fontSize: 16,
    color: Colors.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  list: {
    padding: Spacing.lg,
  },
  savedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  itemName: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  itemDate: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  winnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  winnerText: {
    fontSize: 13,
    color: Colors.warning,
    marginLeft: Spacing.xs,
    marginRight: Spacing.sm,
  },
  savingsText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  unsaveButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
  },
});
