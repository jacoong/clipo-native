import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '../theme/ThemeProvider';

export type ThemedButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
};

const getButtonStyle = (
  state: PressableStateCallbackType,
  variant: ThemedButtonProps['variant'],
  disabled: boolean,
  colors: ReturnType<typeof useAppTheme>['colors'],
  palette: ReturnType<typeof useAppTheme>['palette'],
) => {
  const baseStyles: ViewStyle = {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  };

  if (disabled) {
    return [
      baseStyles,
      {
        backgroundColor: colors.border,
        borderColor: colors.border,
        borderWidth: variant === 'ghost' ? 0 : 1,
      },
    ];
  }

  switch (variant) {
    case 'outline':
      return [
        baseStyles,
        {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: palette.themeColor,
          opacity: state.pressed ? 0.7 : 1,
        },
      ];
    case 'ghost':
      return [
        baseStyles,
        {
          backgroundColor: 'transparent',
          opacity: state.pressed ? 0.6 : 1,
        },
      ];
    case 'primary':
    default:
      return [
        baseStyles,
        {
          backgroundColor: palette.themeColor,
          opacity: state.pressed ? 0.7 : 1,
        },
      ];
  }
};

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}) => {
  const { colors, palette, fonts } = useAppTheme();
  const textColor =
    variant === 'primary' ? palette.customRealWhite : colors.textPrimary;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={(state) =>
        StyleSheet.flatten([
          getButtonStyle(
            state,
            variant,
            disabled || loading,
            colors,
            palette,
          ),
          style,
        ])
      }
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[
            styles.label,
            { color: textColor, fontFamily: fonts.medium },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default ThemedButton;
