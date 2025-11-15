import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../theme/ThemeProvider';

type MenuKey = 'home' | 'search' | 'create' | 'favorites' | 'profile';

type MenuBarProps = {
  active?: MenuKey;
  onPress?: (key: MenuKey) => void;
  visibleKeys?: MenuKey[];
};

const ICONS: Record<MenuKey, keyof typeof Ionicons.glyphMap> = {
  home: 'home',
  search: 'search',
  create: 'add',
  favorites: 'heart-outline',
  profile: 'person',
};

export const MenuBar: React.FC<MenuBarProps> = ({
  active = 'home',
  onPress,
  visibleKeys,
}) => {
  const { colors, palette } = useAppTheme();
  const keys = (visibleKeys ?? (Object.keys(ICONS) as MenuKey[])) as MenuKey[];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {keys.map((key) => {
        const isActive = active === key;
        const iconName = ICONS[key];
        const size = key === 'create' ? 30 : 24;
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={`Navigate to ${key}`}
            onPress={() => onPress?.(key)}
            style={[styles.item, isActive && styles.activeItem]}
          >
            <View
              style={[
                key === 'create' && styles.createWrapper,
                key === 'create' && {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name={iconName}
                size={size}
                color={isActive ? palette.themeColor : colors.textSecondary}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeItem: {
    transform: [{ translateY: -4 }],
  },
  createWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuBar;
