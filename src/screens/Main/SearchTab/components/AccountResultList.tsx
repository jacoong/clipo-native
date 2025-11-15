import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { usePostsPagination } from '../../../../CustomHook/usePagenation';
import { useAppTheme } from '../../../../theme/ThemeProvider';
import ProfileContainer from '../../../../components/ProfileContainer';
import { useDebouncedValue } from '../../../../hooks/useDebouncedValue';
import type { SearchStackParamList } from '../../../../navigation/types';
import type { NavigationProp } from '@react-navigation/native';

export type AccountResultListProps = {
  query: string;
};

type AccountItem = {
  username?: string;
  nickName?: string;
  profilePicture?: string | null;
  description?: string;
  followerNumber?: number;
  followers?: number;
  follower?: number;
  followerCount?: number;
  isFollowing?: boolean;
};

const AccountResultList: React.FC<AccountResultListProps> = ({ query }) => {
  const trimmed = query.trim();
  const debouncedQuery = useDebouncedValue(trimmed, 250);
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createStyles(colors, palette), [colors, palette]);
  const navigation = useNavigation<NavigationProp<SearchStackParamList>>();

  const isEnabled = debouncedQuery.length > 0;
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    usePostsPagination<AccountItem>({
      typeOfFilter: 'Account',
      value: isEnabled ? debouncedQuery : null,
      enabled: isEnabled,
    });

  const accounts = useMemo(() => {
    if (!data?.pages?.length) {
      return [];
    }
    return data.pages.flatMap((page) => page.body?.data ?? []);
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleNavigateProfile = useCallback(
    (item: AccountItem) => {
      const username = item?.username ?? item?.nickName;
      if (!username) {
        return;
      }
      navigation.navigate('ProfileMenu', { username });
    },
    [navigation],
  );


  const renderItem = useCallback(
    ({ item }: { item: AccountItem }) => (
      <ProfileContainer
        variant="accountRow"
        profileImg={item?.profilePicture}
        nickName={item?.nickName ?? item?.username ?? '사용자'}
        showFollowButton
        isFollowing={Boolean(item?.isFollowing)}
        onPress={() => handleNavigateProfile(item)}

      />
    ),
      [handleNavigateProfile],
  );

  if (!isEnabled) {
    return null;
  }

  return (
    <FlatList
      data={accounts}
      keyExtractor={(item, index) => `${item?.username ?? item?.nickName ?? 'account'}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      ListEmptyComponent={
        isFetching ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={palette.themeColor} />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>검색 결과가 없어요</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              다른 키워드를 시도해보세요.
            </Text>
          </View>
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={palette.themeColor} />
          </View>
        ) : null
      }
    />
  );
};

const createStyles = (
  colors: ReturnType<typeof useAppTheme>['colors'],
  palette: ReturnType<typeof useAppTheme>['palette'],
) =>
  StyleSheet.create({
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 32,
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    emptyState: {
      paddingTop: 80,
      paddingHorizontal: 24,
      alignItems: 'center',
      gap: 8,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    emptySubtitle: {
      fontSize: 13,
      textAlign: 'center',
      lineHeight: 18,
    },
  });

export default AccountResultList;
