import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows, getFont } from '../constants/theme';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings, useCache } from '../hooks/useStorage';

const CURRENCIES = [
  { code: '฿', name: 'THB', nameTh: 'บาท' },
  { code: '$', name: 'USD', nameTh: 'ดอลลาร์' },
  { code: '€', name: 'EUR', nameTh: 'ยูโร' },
  { code: '¥', name: 'JPY', nameTh: 'เยน' },
];

export function SettingsScreen() {
  const { t, language, toggleLanguage, isThai } = useLanguage();
  const { settings, updateSettings } = useSettings();
  const { cacheSize, clear, calculateSize } = useCache();
  
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState('฿');

  useEffect(() => {
    if (settings) {
      setCurrentCurrency(settings.currency);
    }
  }, [settings]);

  const handleClearCache = () => {
    Alert.alert(
      t('clearCache') || 'Clear Cache',
      t('confirmClearCache') || `Clear ${cacheSize} of cache?`,
      [
        { text: t('cancel') || 'Cancel', style: 'cancel' },
        { 
          text: t('clear') || 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await clear();
            calculateSize();
          }
        },
      ]
    );
  };

  const selectCurrency = async (code: string) => {
    await updateSettings({ currency: code as any });
    setCurrentCurrency(code);
    setCurrencyModalVisible(false);
  };

  const getCurrencyName = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code);
    return currency ? (isThai ? currency.nameTh : currency.name) : code;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
            {t('settings')}
          </Text>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: getFont('medium', isThai) }]}>
            {t('general') || 'GENERAL'}
          </Text>
          
          {/* Language */}
          <TouchableOpacity style={styles.settingItem} onPress={toggleLanguage}>
            <View style={styles.settingIcon}>
              <Ionicons name="globe-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('language')}
              </Text>
              <Text style={[styles.settingValue, { fontFamily: getFont('regular', isThai) }]}>
                {language === 'th' ? 'ภาษาไทย' : 'English'}
              </Text>
            </View>
            <Text style={styles.flag}>{language === 'th' ? '🇹🇭' : '🇬🇧'}</Text>
          </TouchableOpacity>

          {/* Currency */}
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <View style={styles.settingIcon}>
              <Ionicons name="cash-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('currency') || 'Currency'}
              </Text>
              <Text style={[styles.settingValue, { fontFamily: getFont('regular', isThai) }]}>
                {getCurrencyName(currentCurrency)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Storage Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: getFont('medium', isThai) }]}>
            {t('storage') || 'STORAGE'}
          </Text>
          
          {/* Cache Size */}
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="server-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('cacheSize') || 'Cache Size'}
              </Text>
              <Text style={[styles.settingValue, { fontFamily: getFont('regular', isThai) }]}>
                {cacheSize}
              </Text>
            </View>
          </View>

          {/* Clear Cache */}
          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleClearCache}>
            <View style={[styles.settingIcon, styles.dangerIcon]}>
              <Ionicons name="trash-outline" size={20} color={Colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, styles.dangerText, { fontFamily: getFont('medium', isThai) }]}>
                {t('clearCache') || 'Clear Cache'}
              </Text>
              <Text style={[styles.settingSubtext, { fontFamily: getFont('regular', isThai) }]}>
                {t('clearCacheDesc') || 'Delete all cached data'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: getFont('medium', isThai) }]}>
            {t('about') || 'ABOUT'}
          </Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { fontFamily: getFont('medium', isThai) }]}>
                {t('appName')}
              </Text>
              <Text style={[styles.settingSubtext, { fontFamily: getFont('regular', isThai) }]}>
                Version 1.0.0
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Currency Modal */}
      <Modal 
        visible={currencyModalVisible} 
        transparent 
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { fontFamily: getFont('bold', isThai) }]}>
                {t('selectCurrency') || 'Select Currency'}
              </Text>
              <TouchableOpacity onPress={() => setCurrencyModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            {CURRENCIES.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  currentCurrency === currency.code && styles.currencyOptionSelected,
                ]}
                onPress={() => selectCurrency(currency.code)}
              >
                <Text style={styles.currencyCode}>{currency.code}</Text>
                <Text style={[styles.currencyName, { fontFamily: getFont('medium', isThai) }]}>
                  {isThai ? currency.nameTh : currency.name}
                </Text>
                {currentCurrency === currency.code && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  settingValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  flag: {
    fontSize: 24,
  },
  dangerItem: {
    borderColor: Colors.error + '20',
    borderWidth: 1,
  },
  dangerIcon: {
    backgroundColor: Colors.error + '10',
  },
  dangerText: {
    color: Colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.text,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  currencyOptionSelected: {
    backgroundColor: Colors.primary + '10',
  },
  currencyCode: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    width: 50,
  },
  currencyName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
});
