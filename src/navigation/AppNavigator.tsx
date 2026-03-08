import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { HomeScreen } from '../screens/HomeScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HistoryDetailScreen } from '../screens/HistoryDetailScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Colors, Spacing, getFont } from '../constants/theme';
import { ComparisonResult, Product } from '../types/promotion';
import { useLanguage } from '../hooks/useLanguage';

export type RootStackParamList = {
  Main: undefined;
  Result: {
    comparison: ComparisonResult;
    products: Product[];
  };
  HistoryDetail: {
    historyId: string;
  };
};

export type TabParamList = {
  Home: undefined;
  History: undefined;
  Saved: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, { icon: keyof typeof Ionicons.glyphMap; filled: keyof typeof Ionicons.glyphMap }> = {
    Home: { icon: 'home-outline', filled: 'home' },
    History: { icon: 'time-outline', filled: 'time' },
    Saved: { icon: 'heart-outline', filled: 'heart' },
    Settings: { icon: 'settings-outline', filled: 'settings' },
  };

  const iconName = focused ? icons[name].filled : icons[name].icon;

  return (
    <Ionicons 
      name={iconName} 
      size={24} 
      color={focused ? Colors.primary : Colors.textMuted}
    />
  );
}

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  const { isThai } = useLanguage();
  return (
    <Text style={[styles.tabLabel, { fontFamily: getFont('bold', isThai) }, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabel: ({ focused }) => (
          <TabLabel label={route.name.toUpperCase()} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="HistoryDetail" 
          component={HistoryDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    height: 70,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  tabLabelFocused: {
    color: Colors.primary,
  },
});
