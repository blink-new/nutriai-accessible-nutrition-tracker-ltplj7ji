import React from 'react';
import { View, ViewStyle, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  gradientColors?: string[];
  padding?: number;
  shadow?: boolean;
}

export default function Card({
  children,
  style,
  gradient = false,
  gradientColors,
  padding = 16,
  shadow = true
}: CardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardStyle: ViewStyle = {
    borderRadius: 12,
    padding,
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    ...(shadow && {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    }),
  };

  if (gradient && gradientColors && gradientColors.length >= 2) {
    return (
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        style={[cardStyle, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
}