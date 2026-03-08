import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BorderRadius, Colors, Shadows, Spacing } from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={toggleLanguage}
      activeOpacity={0.8}
    >
      <View style={styles.flagContainer}>
        <Text style={styles.flag}>{language === "th" ? "🇹🇭" : "🇬🇧"}</Text>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 100,
  },
  flagContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  flag: {
    fontSize: 24,
  },
});
