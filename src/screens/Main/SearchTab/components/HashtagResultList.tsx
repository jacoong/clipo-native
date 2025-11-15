import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { usePostsPagination } from '../../../../CustomHook/usePagenation';
import { useAppTheme } from '../../../../theme/ThemeProvider';
import SearchTag from '../../../../components/AccountandTags/SearchTag';

export type HashtagResultListProps = {
  query: string;
  onSelectTag?: (tagWithoutHash: string) => void;
};

type HashtagItem = {
  tagName?: string;
  name?: string;
  count?: number;
  followerNumber?: number;
};

const HashtagResultList: React.FC<HashtagResultListProps> = ({ query, onSelectTag }) => {
  const trimmed = query.trim();
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isEnabled = trimmed.length > 0;
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    usePostsPagination<HashtagItem>({
      typeOfFilter: 'Hashtag',
      value: isEnabled ? trimmed : null,
      enabled: isEnabled,
    });

  const tags = useMemo(() => {
    if (!data?.pages?.length) {
      return [];
    }
    return data.pages.flatMap((page) => {
      const items = page.body?.data ?? [];
      return items.map((entry) => (typeof entry === 'string' ? entry : entry?.tagName ?? entry?.name ?? ''));
    });
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: HashtagItem | string }) => {
      const raw = typeof item === 'string' ? item : item?.tagName ?? item?.name ?? '';
      if (!raw) {
        return null;
      }

      const tagValue = raw.startsWith('#') ? raw.slice(1) : raw;
      return (
        <SearchTag
          tagName={`#${tagValue}`}
          onPress={() => onSelectTag?.(tagValue)}
          style={styles.tagItem}
        />
      );
    },
    [onSelectTag, styles.tagItem],
  );

  if (!isEnabled) {
    return null;
  }

  return (
    <FlatList
      data={tags}
      keyExtractor={(item, index) =>
        `${typeof item === 'string' ? item : item?.tagName ?? item?.name ?? 'tag'}-${index}`
      }
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      keyboardShouldPersistTaps="handled"
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={palette.themeColor} />
          </View>
        ) : null
      }
      ListEmptyComponent={
        isFetching ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={palette.themeColor} />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              검색된 태그가 없어요
            </Text>
          </View>
        )
      }
      contentContainerStyle={styles.listContent}
    />
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    loader: {
      paddingVertical: 32,
      alignItems: 'center',
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    emptyState: {
      paddingVertical: 48,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
    },
    tagItem: {
      paddingVertical: 10,
    },
  });

export default HashtagResultList;
