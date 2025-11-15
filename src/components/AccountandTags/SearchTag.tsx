import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '../../theme/ThemeProvider';
import type { SearchStackParamList } from '../../navigation/types';

type SearchTagProps = {
  tagName: string;
  isClickable?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: (tagWithoutHash: string) => void;
};

const removeHash = (raw: string) => (raw.startsWith('#') ? raw.slice(1) : raw);

const SearchTag: React.FC<SearchTagProps> = ({
  tagName,
  isClickable = true,
  isDark,
  style,
  onPress,
}) => {
  const navigation = useNavigation<NavigationProp<SearchStackParamList>>();
  const { colors, mode } = useAppTheme();
  const resolvedIsDark = isDark ?? mode === 'dark';
  const tagWithoutHash = removeHash(tagName.trim());

  const handleNavigate = useCallback(() => {
    if (!isClickable) {
      return;
    }

    if (onPress) {
      onPress(tagWithoutHash);
      return;
    }

    navigation.navigate('TagsPost', { tagValue: tagWithoutHash });
  }, [isClickable, navigation, onPress, tagWithoutHash]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleNavigate}
      style={[styles.container, style]}
      disabled={!isClickable}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.iconWrapper,
            {
              borderColor: resolvedIsDark ? colors.textPrimary : colors.border,
              backgroundColor: resolvedIsDark ? colors.surface : colors.card,
            },
          ]}
        >
          <Ionicons
            name="pricetags-outline"
            size={18}
            color={resolvedIsDark ? colors.textPrimary : colors.textSecondary}
          />
        </View>
        <Text style={[styles.text, { color: colors.textPrimary }]} numberOfLines={1}>
          {tagWithoutHash}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});

export default SearchTag;
