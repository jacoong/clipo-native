import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../../theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type FlashMessageType = 'success' | 'error' | 'info' | 'caution' | 'brand';

export type FlashMessagePayload = {
  type?: FlashMessageType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

interface FlashMessageOverlayProps {
  message: FlashMessagePayload | null;
  onClose: () => void;
}

const FlashMessageOverlay: React.FC<FlashMessageOverlayProps> = ({ message, onClose }) => {
  const { colors, palette } = useAppTheme();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;

  if (!message) {
    return null;
  }

  const { title, description, actionLabel = 'OK', onAction, type = 'success' } = message;

  const typeColorMap: Record<FlashMessageType, string> = {
    success: '#2DB248',
    error: palette.customRed,
    info: palette.customBlue ?? palette.themeColor,
    caution: '#F5A524',
    brand: palette.themeColor,
  } as const;

  const iconNameMap: Record<FlashMessageType, keyof typeof Ionicons.glyphMap> = {
    success: 'checkmark',
    error: 'close',
    info: 'information',
    caution: 'alert',
    brand: 'sparkles',
  };

  const iconColor = typeColorMap[type] ?? palette.themeColor;

  const handleAction = () => {
    onAction?.();
    onClose();
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          bottom: Math.max(windowHeight * 0.14),
        },
      ]}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: `${iconColor}1A` }]}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
            <Ionicons name={iconNameMap[type]} size={18} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
          {description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
              {description}
            </Text>
          ) : null}
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleAction}
          accessibilityRole="button"
        >
          <Text style={[styles.actionLabel, { color: palette.themeColor }]}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 1000,
  },
  container: {
    minWidth: 280,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrapper: {
    width: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
  },
  actionButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 32,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FlashMessageOverlay;
