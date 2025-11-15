import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';

interface HoverBackgroundProps {
  children: ReactNode;
  handleClick?: () => void;
  px?: number;
  py?: number;
  scale?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const TAILWIND_SCALE_FACTOR = 4;

const HoverBackground: React.FC<HoverBackgroundProps> = ({
  children,
  handleClick,
  scale = 10,
  px = 4,
  py = 4,
  style,
  contentStyle,
}) => {
  const { mode, palette } = useAppTheme();
  const [isPressed, setIsPressed] = useState(false);
  const baseSize = useMemo(() => scale * TAILWIND_SCALE_FACTOR, [scale]);
  const [contentSize, setContentSize] = useState({ width: baseSize, height: baseSize });

  const highlightColor = useMemo(
    () => (mode === 'dark' ? palette.hovercustomBlack : palette.hoverLightGray),
    [mode, palette],
  );
  const highlightOverlay = useMemo(
    () => hexToRgba(highlightColor, mode === 'dark' ? 0.35 : 0.25),
    [highlightColor, mode],
  );

  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleActiveState = useCallback(
    (isActive: boolean) => {
      setIsPressed(isActive);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: isActive ? 1.1 : 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnim, {
          toValue: isActive ? 1 : 0,
          duration: 160,
          useNativeDriver: false,
        }),
      ]).start();
    },
    [backgroundAnim, scaleAnim],
  );

  useEffect(() => {
    setContentSize((prev) => ({
      width: Math.max(prev.width, baseSize),
      height: Math.max(prev.height, baseSize),
    }));
  }, [baseSize]);

  const circleSize = Math.max(baseSize, contentSize.width, contentSize.height);

  const animatedBackgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', highlightOverlay],
  });

  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContentSize((prev) => {
      if (
        Math.abs(prev.width - width) < 0.5 &&
        Math.abs(prev.height - height) < 0.5
      ) {
        return prev;
      }
      return {
        width,
        height,
      };
    });
  }, []);

  return (
    <Pressable
      onPress={handleClick}
      onPressIn={() => handleActiveState(true)}
      onPressOut={() => handleActiveState(false)}
      onHoverIn={() => handleActiveState(true)}
      onHoverOut={() => handleActiveState(false)}
      android_ripple={{
        color: highlightColor,
        borderless: true,
        radius: circleSize / 2,
      }}
      style={[styles.container, { paddingHorizontal: px, paddingVertical: py }, style]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.background,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: animatedBackgroundColor,
            transform: [{ scale: scaleAnim }],
            shadowColor: highlightColor,
            shadowOffset: { width: 0, height: isPressed ? 6 : 0 },
            shadowOpacity: isPressed ? 0.2 : 0,
            shadowRadius: isPressed ? 12 : 0,
            elevation: isPressed ? 8 : 0,
          },
        ]}
      />
      <View
        onLayout={handleContentLayout}
        style={[styles.content, contentStyle]}
        pointerEvents="none"
      >
        {children}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    zIndex: 0,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

export default HoverBackground;

const hexToRgba = (hexColor: string, alpha: number) => {
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const bigint = Number.parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
