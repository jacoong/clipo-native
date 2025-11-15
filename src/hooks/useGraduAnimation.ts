import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export const useGraduAnimation = (basePadding = 0, duration = 180) => {
  const padding = useSharedValue(basePadding);

  // basePadding 변경 시 즉시 반영
  useEffect(() => {
    padding.value = basePadding;
  }, [basePadding]);

  useKeyboardHandler(
    {
      onStart: (event) => {
        'worklet';
        const keyboardHeight = Math.max(0, event.height ?? 0);
        padding.value = withTiming(basePadding + keyboardHeight, { duration });
      },
      onMove: (event) => {
        'worklet';
        const keyboardHeight = Math.max(0, event.height ?? 0);
        padding.value = withTiming(basePadding + keyboardHeight, { duration });
      },
      onEnd: () => {
        'worklet';
        padding.value = withTiming(basePadding, { duration });
      },
    },
    [basePadding], // ✅ 의존성 추가!
  );

  return useAnimatedStyle(() => ({
    paddingBottom: padding.value,
  })); // ✅ 불필요한 의존성 제거
};
