import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { useAppTheme } from '../theme/ThemeProvider';

export type ButtonVariant = 'default' | 'primary' | 'outline' | 'ghost';

type ButtonStyle =
  | StyleProp<ViewStyle>
  | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);

export type ButtonComponentProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  pill?: boolean;
  fullWidth?: boolean;
  style?: ButtonStyle;
  textStyle?: StyleProp<TextStyle>;
};

const getContainerStyle = (
  state: PressableStateCallbackType,
  {
    variant,
    pill,
    disabled,
    fullWidth,
    colors,
    palette,
    mode,
  }: {
    variant: ButtonVariant;
    pill: boolean;
    disabled: boolean;
    fullWidth: boolean;
    colors: ReturnType<typeof useAppTheme>['colors'];
    palette: ReturnType<typeof useAppTheme>['palette'];
    mode: ReturnType<typeof useAppTheme>['mode'];
  },
) => {
  const base: ViewStyle = {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: pill ? 999 : 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  };

  if (fullWidth) {
    base.alignSelf = 'stretch';
  }

  const pressedStyle: ViewStyle | undefined = state.pressed
    ? { transform: [{ scale: 0.98 }] }
    : undefined;

  if (disabled) {
    return [
      base,
      {
        backgroundColor: colors.border,
        borderColor: colors.border,
      },
      pressedStyle,
    ];
  }

  switch (variant) {
    case 'primary':
      return [
        base,
        {
          backgroundColor:
            mode === 'dark'
              ? palette.customRealWhite
              : palette.customBlack,
          borderColor:
            mode === 'dark'
              ? palette.customRealWhite
              : palette.customBlack,
          opacity: state.pressed ? 0.85 : 1,
        },
        pressedStyle,
      ];
    case 'outline':
      return [
        base,
        {
          backgroundColor: 'transparent',
          borderColor: palette.themeColor,
          borderWidth: 1,
          opacity: state.pressed ? 0.85 : 1,
        },
        pressedStyle,
      ];
    case 'ghost':
      return [
        base,
        {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          opacity: state.pressed ? 0.6 : 1,
        },
        pressedStyle,
      ];
    case 'default':
    default:
      return [
        base,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: state.pressed ? 0.9 : 1,
        },
        pressedStyle,
      ];
  }
};

const getLabelColor = (
  variant: ButtonVariant,
  palette: ReturnType<typeof useAppTheme>['palette'],
  colors: ReturnType<typeof useAppTheme>['colors'],
  mode: ReturnType<typeof useAppTheme>['mode'],
) => {
  switch (variant) {
    case 'primary':
      return mode === 'dark'
        ? palette.customBlack
        : palette.customRealWhite;
    case 'outline':
    case 'default':
      return palette.themeColor;
    case 'ghost':
    default:
      return colors.textPrimary;
  }
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'default',
  pill = true,
  fullWidth = true,
  style,
  textStyle,
}) => {
  const theme = useAppTheme();
  const { palette, colors, fonts, mode } = theme;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={(state) =>
        StyleSheet.flatten([
          getContainerStyle(state, {
            variant,
            pill,
            disabled: disabled || loading,
            fullWidth,
            colors,
            palette,
            mode,
          }),
          typeof style === 'function' ? style(state) : style,
        ])
      }
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getLabelColor(variant, palette, colors, mode)}
        />
      ) : (
        <Text
          style={[
            styles.label,
            {
              color: getLabelColor(variant, palette, colors, mode),
              fontFamily: fonts.medium,
            },
            textStyle,
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
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default ButtonComponent;
