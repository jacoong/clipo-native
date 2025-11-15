import React from 'react';
import { View, StyleSheet } from 'react-native';

import { useAppTheme } from '../../theme/ThemeProvider';

const PostItemSkeleton: React.FC = () => {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatarSmall} />
        <View style={styles.headerText}>
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLineShort} />
        </View>
      </View>

      <View style={styles.skeletonBody}>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineMedium} />
      </View>

      <View style={styles.iconRow}>
        {Array.from({ length: 4 }).map((_, iconIdx) => (
          <View key={iconIdx} style={styles.iconPlaceholder} />
        ))}
      </View>
    </View>
  );
};

const createStyles = ({
  colors,
}: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    postCard: {
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
      gap: 16,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatarSmall: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
    },
    headerText: {
      flex: 1,
      gap: 8,
    },
    skeletonLine: {
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.skeletonBase,
    },
    skeletonLineShort: {
      width: '40%',
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.skeletonBase,
    },
    skeletonBody: {
      gap: 10,
    },
    skeletonLineMedium: {
      width: '70%',
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.skeletonBase,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconPlaceholder: {
      width: 28,
      height: 28,
      borderRadius: 10,
      backgroundColor: colors.card,
    },
  });

export default PostItemSkeleton;
