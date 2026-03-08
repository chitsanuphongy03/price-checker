import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BorderRadius, Colors, Shadows, Spacing } from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";

interface CompareButtonProps {
  onPress: () => void;
  disabled?: boolean;
  title?: string;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function CompareButton({
  onPress,
  disabled = false,
  title,
  style,
}: CompareButtonProps) {
  const { t } = useLanguage();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(0.95, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        animatedStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.text, disabled && styles.textDisabled]}>
          {title || t("compareBestDeal")}
        </Text>
        <Text style={[styles.icon, disabled && styles.textDisabled]}> 📊</Text>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
    ...Shadows.lg,
  },
  disabled: {
    backgroundColor: Colors.border,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: "700",
  },
  icon: {
    fontSize: 18,
    color: Colors.card,
    marginLeft: Spacing.xs,
  },
  textDisabled: {
    color: Colors.textMuted,
  },
});
