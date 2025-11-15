import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../../theme/ThemeProvider';

export type ToolType =
  | 'reply'
  | 'like'
  | 'linkCopy'
  | 'tags'
  | 'morePicture'
  | 'likeVisible'
  | 'replyAllowed'
  | 'postMenu'
  | 'SpecificPage';

export type ToolValue = {
  numberValue?: number;
  isLike?: boolean;
  isLikeVisible?: boolean;
  isReplyAllowed?: boolean;
  postInfo?: any;
};

export type PostToolDescriptor = {
  type: ToolType;
  value: ToolValue;
};

type PostToolProps = {
  typeOfTool: PostToolDescriptor;
  isDark?: boolean;
  onPress?: (type: ToolType) => void;
};

const ICON_SIZE = 20;

const PostTool: React.FC<PostToolProps> = ({ typeOfTool, isDark = false, onPress }) => {
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, palette, isDark), [colors, palette, isDark]);
  const handlePress = useCallback(() => {
    onPress?.(typeOfTool.type);
  }, [onPress, typeOfTool.type]);

  const renderIcon = () => {
    switch (typeOfTool.type) {
      case 'reply':
      case 'replyAllowed':
        return (
          typeOfTool.value?.isReplyAllowed === false ? (
            <MaterialCommunityIcons
              name="message-off-outline"
              size={ICON_SIZE}
              color={styles.icon.color}
            />
          ) : (
            <Ionicons name="chatbubble-outline" size={ICON_SIZE} color={styles.icon.color} />
          )
        );
      case 'like':
        return (
          <Ionicons
            name={typeOfTool.value?.isLike ? 'heart' : 'heart-outline'}
            size={ICON_SIZE}
            color={typeOfTool.value?.isLike ? palette.themeColor : styles.icon.color}
          />
        );
      case 'linkCopy':
        return <Ionicons name="share-outline" size={ICON_SIZE} color={styles.icon.color} />;
      case 'tags':
        return <Ionicons name="pricetag-outline" size={ICON_SIZE} color={styles.icon.color} />;
      case 'morePicture':
        return <Ionicons name="images-outline" size={ICON_SIZE} color={styles.icon.color} />;
      case 'likeVisible':
        return (
          typeOfTool.value?.isLikeVisible === false ? (
            <MaterialCommunityIcons
              name="heart-off-outline"
              size={ICON_SIZE}
              color={styles.icon.color}
            />
          ) : (
            <Ionicons name="heart-outline" size={ICON_SIZE} color={styles.icon.color} />
          )
        );
      case 'postMenu':
        return <Ionicons name="ellipsis-horizontal" size={ICON_SIZE} color={styles.icon.color} />;
      case 'SpecificPage':
        return <Ionicons name="chevron-down" size={ICON_SIZE} color={styles.icon.color} />;
      default:
        return null;
    }
  };

  const resolvedValue = () => {
    if (typeOfTool.type === 'like' && typeof typeOfTool.value?.numberValue === 'number') {
      return typeOfTool.value.numberValue;
    }
    if (typeOfTool.type === 'reply' && typeof typeOfTool.value?.numberValue === 'number') {
      return typeOfTool.value.numberValue > 0 ? typeOfTool.value.numberValue : null;
    }
    return null;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      hitSlop={8}
    >
      <View style={styles.iconWrapper}>{renderIcon()}</View>
      {resolvedValue() != null ? (
        <Text style={styles.valueText}>{resolvedValue()}</Text>
      ) : null}
    </Pressable>
  );
};

const createStyles = (
  colors: ReturnType<typeof useAppTheme>['colors'],
  palette: ReturnType<typeof useAppTheme>['palette'],
  isDark: boolean,
) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      gap: 3,
      borderRadius: 999,
    },
    pressed: {
      backgroundColor: isDark ? colors.card : palette.hoverLightGray,
    },
    iconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      color: isDark ? colors.textPrimary : colors.textSecondary,
    },
    valueText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
  });

export default PostTool;
