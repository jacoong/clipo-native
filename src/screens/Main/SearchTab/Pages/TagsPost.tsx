import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import PageNationStandard from '../../../../components/InfinityScroll/PageNationStandard';
import { useAppTheme } from '../../../../theme/ThemeProvider';
import type { SearchStackParamList } from '../../../../navigation/types';

const TagsPost: React.FC = () => {
  const route = useRoute<RouteProp<SearchStackParamList, 'TagsPost'>>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const tagValue = route.params?.tagValue ?? route.params?.value ?? '';

  return (
    <View style={styles.container}>
      <PageNationStandard
        typeOfFilter="PostWithTags"
        value={tagValue}
        emptyStateComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              해당 태그 게시물이 없어요
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              다른 태그를 검색해보세요.
            </Text>
          </View>
        }
      />
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    emptyState: {
      paddingVertical: 80,
      alignItems: 'center',
      gap: 8,
    },
    emptyTitle: {
      fontSize: 17,
      fontWeight: '600',
    },
    emptySubtitle: {
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
    },
  });

export default TagsPost;
