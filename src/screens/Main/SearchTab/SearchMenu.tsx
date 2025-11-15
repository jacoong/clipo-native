import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchMain from './Pages/SearchMain';
import SearchResultPage from './Pages/SearchResultPage';
import TagsPost from './Pages/TagsPost';
import ProfileMenu from '../ProfileTab/ProfileMenu';
import { SearchStackParamList } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/ThemeProvider';

const Stack = createNativeStackNavigator<SearchStackParamList>();

const SearchMenu: React.FC = () => {
  const { colors } = useAppTheme();
  const screenOptions = useMemo(
    () => ({
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: colors.background,
        height: 48,
      },
      headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' as const },
      headerTintColor: colors.textPrimary,
      headerTitleAlign: 'center' as const,
      contentStyle: {
        backgroundColor: colors.background,
        paddingTop: 10,
      },
    }),
    [colors.background, colors.textPrimary],
  );

  return (
    <Stack.Navigator id={undefined} screenOptions={screenOptions}>
      <Stack.Screen
        name="SearchMain"
        component={SearchMain}
        options={{
          title: '검색',
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="SearchResultPage"
        component={SearchResultPage}
        options={({ route }) => ({
          title: route.params?.value ?? '검색 결과',
        })}
      />
      <Stack.Screen
        name="TagsPost"
        component={TagsPost}
        options={({ route }) => ({
          title: `#${route.params?.tagValue ?? ''}`,
        })}
      />
      <Stack.Screen
        name="ProfileMenu"
        component={ProfileMenu}
        options={{ headerShown: true, title: '프로필' }}
      />
    </Stack.Navigator>
  );
};

export default SearchMenu;
