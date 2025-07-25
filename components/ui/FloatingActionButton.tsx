import React from 'react';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  bottom?: number;
  right?: number;
}

export default function FloatingActionButton({
  onPress,
  icon = 'add',
  size = 56,
  bottom = 100,
  right = 20,
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    runOnJS(onPress)();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        {
          position: 'absolute',
          bottom,
          right,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#4CAF50',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 1000,
        },
        animatedStyle,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Add new item"
      accessibilityHint="Tap to add a new meal or access AI features"
    >
      <Ionicons
        name={icon}
        size={size * 0.4}
        color="#FFFFFF"
      />
    </AnimatedTouchableOpacity>
  );
}