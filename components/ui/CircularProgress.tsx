import React, { useEffect } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0 to 100
  color?: string;
  backgroundColor?: string;
  showText?: boolean;
  text?: string;
  duration?: number;
}

export default function CircularProgress({
  size,
  strokeWidth,
  progress,
  color = '#4CAF50',
  backgroundColor,
  showText = true,
  text,
  duration = 1000,
}: CircularProgressProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progressValue = useSharedValue(0);
  
  const defaultBackgroundColor = backgroundColor || (isDark ? '#333333' : '#E5E5E5');

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, duration]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (progressValue.value / 100) * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={defaultBackgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {showText && (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: size * 0.15,
              fontFamily: 'Inter',
              fontWeight: '600',
              color: isDark ? '#FFFFFF' : '#212121',
              textAlign: 'center',
            }}
          >
            {text || `${Math.round(progress)}%`}
          </Text>
        </View>
      )}
    </View>
  );
}