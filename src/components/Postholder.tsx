import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import type { userPost } from '@clipo/core';

import PostItem from './Posts/PostItem';
import NoNumberLoad from './NoNumberLoad';
import LoadingIndicator from './LoadingIndicator';
import { useAppTheme } from '../theme/ThemeProvider';

type PostholderProps = {
  posts: userPost[] | null;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onEndReached?: () => void;
  onPressPost?: (post: userPost) => void;
  onPressComments?: (post: userPost) => void;
  emptyStateComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
};

const Postholder: React.FC<PostholderProps> = ({
  posts,
  isLoading = false,
  isLoadingMore = false,
  onEndReached,
  onPressPost,
  onPressComments,
  emptyStateComponent,
  headerComponent,
}) => {
  const { colors, palette } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (isLoading && !posts) {
    return (
      <View style={styles.loaderWrapper}>
        <LoadingIndicator />
      </View>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.emptyWrapper}>
        {emptyStateComponent ?? (
          <NoNumberLoad
            title="게시물이 없어요"
            description="첫 번째 게시물을 작성해보세요."
          />
        )}
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, index) => {
        const identifier = item.bno ?? item.rno ?? index;
        return `${item.typeOfPost}-${identifier}-${index}`;
      }}
      renderItem={({ item }) => (
        <PostItem
          postInfo={item}
          onPressPost={onPressPost}
          onPressComments={onPressComments}
        />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.2}
      ListHeaderComponent={headerComponent ?? null}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={palette.themeColor} />
          </View>
        ) : null
      }
      contentContainerStyle={styles.listContent}
    />
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    loaderWrapper: {
      paddingVertical: 24,
    },
    emptyWrapper: {
      flex: 1,
      paddingVertical: 48,
    },
    listContent: {
      paddingBottom: 48,
    },
    footerLoader: {
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Postholder;
