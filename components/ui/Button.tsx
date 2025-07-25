import React from 'react';
import { TouchableOpacity, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  style,
  textStyle
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    if (!disabled) {
      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: size === 'small' ? 36 : size === 'large' ? 56 : 44,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 24 : 20,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: isDark ? '#333333' : '#E5E5E5',
        opacity: 0.6,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#4CAF50',
        };
      case 'accent':
        return {
          ...baseStyle,
          backgroundColor: '#FF8C00',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: isDark ? '#666666' : '#CCCCCC',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      textAlign: 'center',
    };

    if (disabled) {
      return {
        ...baseStyle,
        color: isDark ? '#666666' : '#999999',
      };
    }

    switch (variant) {
      case 'primary':
      case 'accent':
        return {
          ...baseStyle,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: isDark ? '#FFFFFF' : '#212121',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[animatedStyle, getButtonStyle(), style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={disabled ? 'Button is disabled' : `Tap to ${title.toLowerCase()}`}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
}