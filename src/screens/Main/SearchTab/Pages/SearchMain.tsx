import React, { useCallback, useMemo, useState ,useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { useAppTheme } from '../../../../theme/ThemeProvider';
import SearchInputBar, { SearchChangePayload } from '../../../../components/Search/SearchInputBar';
import AccountResultList from '../components/AccountResultList';
import HashtagResultList from '../components/HashtagResultList';
import type { SearchStackParamList } from '../../../../navigation/types';

type FilterType = 'Account' | 'Hashtag';

const SearchMain: React.FC = () => {
  const navigation = useNavigation<NavigationProp<SearchStackParamList>>();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [searchState, setSearchState] = useState<{
    value: string;
    filter: FilterType;
  }>({ value: '', filter: 'Account' });

  const isHashtagMode = searchState.filter === 'Hashtag';

  const handleSearchChange = useCallback((payload: SearchChangePayload) => {
    setSearchState({
      value: payload.value,
      filter: payload.filter,
    });
  }, []);

  const handleSearchSubmit = useCallback(
    (payload: SearchChangePayload) => {
      setSearchState({
        value: payload.value,
        filter: payload.filter,
      });

      const trimmed = payload.value.trim();
      if (trimmed.length === 0) {
        return;
      }

      navigation.navigate('SearchResultPage', {
        typeOfFilter: payload.filter,
        value: trimmed,
      });
    },
    [navigation],
  );



  const handleSelectTag = useCallback((tagWithoutHash: string) => {
    setSearchState({
      value: tagWithoutHash,
      filter: 'Hashtag',
    });
    navigation.navigate('TagsPost', {
      tagValue: `#${tagWithoutHash}`,
      typeOfFilter: 'PostWithTags',
    });
  }, []);

  useEffect(()=>{
    console.log('searchState',searchState);
  },[searchState])

  const hasQuery = searchState.value.trim().length > 0;

  return (
    <View style={styles.safeArea}>

      <View style={styles.searchBarWrapper}>
        <SearchInputBar
          value={searchState.value}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
        />
      </View>

      {!hasQuery ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>검색어를 입력하세요</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>찾고 싶은 계정 또는 태그를 입력해보세요.</Text>
        </View>
      ) : isHashtagMode ? (
        <HashtagResultList query={searchState.value} onSelectTag={handleSelectTag} />
      ) : (
        <AccountResultList query={searchState.value} />
      )}
    </View>
  );
};

const createStyles = (
  colors: ReturnType<typeof useAppTheme>['colors'],
) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchBarWrapper: {
      marginHorizontal: 20,
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

export default SearchMain;
