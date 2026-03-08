import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, getFont } from '../constants/theme';
import { useLanguage } from '../hooks/useLanguage';

export function SavedScreen() {
  const { t, isThai } = useLanguage();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Ionicons name="heart-outline" size={48} color={Colors.textMuted} />
        <Text style={[styles.title, { fontFamily: getFont('bold', isThai) }]}>
          {t('saved') || 'Saved'}
        </Text>
        <Text style={[styles.subtitle, { fontFamily: getFont('regular', isThai) }]}>
          Coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
