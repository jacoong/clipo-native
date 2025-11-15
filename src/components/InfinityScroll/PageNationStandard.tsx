import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  ListRenderItem,
  RefreshControl,
} from 'react-native';
import type { userPost } from '@clipo/core';

import { usePostsPagination } from '../../CustomHook/usePagenation';
import LoadingIndicator from '../LoadingIndicator';
import NoNumberLoad from '../NoNumberLoad';
import PostItem from '../Posts/PostItem';
import { useAppTheme } from '../../theme/ThemeProvider';
import useFlashMessage from '../../hooks/useFlashMessage';
type TypeOfFilter =
  | 'Activity'
  | 'NestRe'
  | 'MainRandom'
  | 'Post'
  | 'Replies'
  | 'Likes'
  | 'Reply'
  | 'Following'
  | 'Follower'
  | 'LikedUser'
  | 'Account'
  | 'Hashtag'
  | 'PostWithTags'
  | 'FollowingPost'
  | 'Saved';

type PaginationMode = 'infiniteScroll' | 'loadMore' | 'pageNumbers';

interface Props<T = userPost> {
  typeOfFilter: TypeOfFilter;
  username?: string;
  bno?: number;
  rno?: number;
  value?: string | null;
  numberOfComment?: number;
  pagenationPage?: PaginationMode;
  emptyStateComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
  onPressPost?: (post: userPost) => void;
  onPressComments?: (post: userPost) => void;
  renderItem?: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
}

const LOAD_MORE_THRESHOLD = 200; // px

const PageNationStandard = <T = userPost,>({
  typeOfFilter,
  username,
  bno,
  rno,
  value,
  pagenationPage = 'infiniteScroll',
  emptyStateComponent,
  headerComponent,
  onPressPost,
  onPressComments,
  renderItem: customRenderItem,
  keyExtractor: customKeyExtractor,
}: Props<T>) => {
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { showMessage } = useFlashMessage();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = usePostsPagination<T>({
    typeOfFilter,
    username,
    bno,
    rno,
    value,
    enabled: true,
  });

  const [items, setItems] = useState<T[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadingInitial = isFetching && !data;

  useEffect(() => {
    if (!data) {
      return;
    }
    const combined = data.pages.flatMap((page) => page.body.data ?? []) as T[];
    setItems(combined);
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || pagenationPage !== 'infiniteScroll') {
      return;
    }
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, pagenationPage]);

  const isEmpty = !loadingInitial && (!items || items.length === 0);

  const headerElement = useMemo(
    () =>
      headerComponent ? (
        <View style={styles.headerWrapper}>{headerComponent}</View>
      ) : null,
    [headerComponent, styles.headerWrapper],
  );

  const defaultRenderItem = useCallback<ListRenderItem<userPost>>(
    ({ item }) => (
      <PostItem
        postInfo={item}
        onPressPost={onPressPost}
        onPressComments={onPressComments}
      />
    ),
    [onPressComments, onPressPost],
  );

  const renderItem = useMemo<ListRenderItem<T>>(
    () =>
      customRenderItem ??
      ((defaultRenderItem as unknown) as ListRenderItem<T>),
    [customRenderItem, defaultRenderItem],
  );

  const defaultKeyExtractor = useCallback((item: userPost, index: number) => {
    const identifier = item.bno ?? item.rno ?? index;
    return `${item.typeOfPost}-${identifier}-${index}`;
  }, []);

  const keyExtractor = useMemo(
    () =>
      customKeyExtractor ??
      ((defaultKeyExtractor as unknown) as (item: T, index: number) => string),
    [customKeyExtractor, defaultKeyExtractor],
  );

  const listFooter = useMemo(() => {
    if (!isFetchingNextPage) {
      return null;
    }
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={palette.themeColor} />
      </View>
    );
  }, [isFetchingNextPage, palette.themeColor, styles.footerLoader]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) {
      return;
    }
    setIsRefreshing(true);
    try {
      await refetch();
      showMessage({
        type: 'success',
        title: '업데이트 완료',
        description: '최신 게시물을 불러왔어요.',
      });
    } catch (error) {
      showMessage({
        type: 'error',
        title: '새로고침 실패',
        description: '잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, refetch, showMessage]);

  if (loadingInitial) {
    return (
      <View style={styles.loaderWrapper}>
        <LoadingIndicator />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.container}>
        {headerElement}
        <View style={styles.emptyWrapper}>
          {emptyStateComponent ?? (
            <NoNumberLoad
              title="게시물이 없어요"
              description="첫 번째 게시물을 작성해보세요."
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isRefreshing ? (
        <View pointerEvents="none" style={styles.topSpinner}>
          <ActivityIndicator size="small" color={palette.themeColor} />
        </View>
      ) : null}
      <FlatList
        data={items ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={listFooter}
        ListHeaderComponent={headerElement}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={palette.themeColor}
          />
        }
      />
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    loaderWrapper: {
      paddingVertical: 24,
    },
    emptyWrapper: {
      flex: 1,
      paddingVertical: 48,
    },
    headerWrapper: {
      paddingBottom: 16,
    },
    listContent: {
      paddingBottom: 48,
    },
    topSpinner: {
      position: 'absolute',
      top: 12,
      alignSelf: 'center',
      zIndex: 5,
    },
    footerLoader: {
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default PageNationStandard;
