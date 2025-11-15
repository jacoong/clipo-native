import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { ListRenderItem } from 'react-native';

import PageNationStandard from '../../../../components/InfinityScroll/PageNationStandard';
import ProfileContainer from '../../../../components/ProfileContainer';
import SearchTag from '../../../../components/AccountandTags/SearchTag';
import { useAppTheme } from '../../../../theme/ThemeProvider';
import type { MainStackParamList, SearchStackParamList } from '../../../../navigation/types';

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

type HashtagItem = string | { tagName?: string; name?: string };

const SearchResultPage: React.FC = () => {
  const route = useRoute<RouteProp<SearchStackParamList, 'SearchResultPage'>>();
  const navigation = useNavigation<NavigationProp<MainStackParamList & SearchStackParamList>>();

  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { typeOfFilter, value } = route.params;
  const isAccountMode = typeOfFilter === 'Account';

  const handleOpenProfile = useCallback(
    (username?: string) => {
      if (!username) {
        return;
      }
      navigation.navigate('ProfileMenu', { username });
    },
    [navigation],
  );

  const handleOpenTag = useCallback(
    (tagValue: string) => {
      navigation.navigate('TagsPost', {
        tagValue,
      });
    },
    [navigation],
  );

  const renderAccountItem = useCallback<ListRenderItem<AccountItem>>(
    ({ item }) => {
      const nick = item?.nickName ?? item?.username;
      if (!nick) {
        return null;
      }
      return (
        <ProfileContainer
          variant="accountRow"
          profileImg={item?.profilePicture}
          nickName={nick}
          subtitle={item?.description}
          metaText={
            item?.followerNumber || item?.followers || item?.followerCount
              ? `팔로워 ${item?.followerNumber ?? item?.followers ?? item?.followerCount}`
              : undefined
          }
          onPress={() => handleOpenProfile(item?.username ?? item?.nickName)}
          isClickable
        />
      );
    },
    [handleOpenProfile],
  );

  const renderHashtagItem = useCallback<ListRenderItem<HashtagItem>>(
    ({ item }) => {
      const raw =
        typeof item === 'string'
          ? item
          : item?.tagName ?? item?.name ?? '';
      if (!raw) {
        return null;
      }
      const normalized = raw.startsWith('#') ? raw.slice(1) : raw;
      return (
        <SearchTag
          tagName={`#${normalized}`}
          onPress={() => handleOpenTag(normalized)}
          style={styles.tagItem}
        />
      );
    },
    [handleOpenTag, styles.tagItem],
  );

  const emptyComponent = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          검색 결과가 없어요
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          다른 키워드를 시도해보세요.
        </Text>
      </View>
    ),
    [colors.textPrimary, colors.textSecondary, styles.emptyState, styles.emptySubtitle, styles.emptyTitle],
  );

  if (isAccountMode) {
    return (
      <PageNationStandard<AccountItem>
        typeOfFilter="Account"
        value={value}
        renderItem={renderAccountItem}
        keyExtractor={(item, index) =>
          `${item?.username ?? item?.nickName ?? 'account'}-${index}`
        }
        emptyStateComponent={emptyComponent}
      />
    );
  }

  return (
    <PageNationStandard<HashtagItem>
      typeOfFilter="Hashtag"
      value={value}
      renderItem={renderHashtagItem}
      keyExtractor={(item, index) => {
        const raw =
          typeof item === 'string'
            ? item
            : item?.tagName ?? item?.name ?? 'tag';
        return `${raw}-${index}`;
      }}
      emptyStateComponent={emptyComponent}
    />
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
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
    tagItem: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
  });

export default SearchResultPage;
