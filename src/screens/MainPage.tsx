import React, { useMemo, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import RecommandPost from './Main/HomeTab/RecommandPost';
import FollowingPost from './Main/HomeTab/FollowingPost';
import LikedPost from './Main/HomeTab/LikedPost';
import NaviDetailPost from './Main/HomeTab/NaviDetailPost';
import {
  HomeDrawerParamList,
  HomeMenuStackParamList,
  MainStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../navigation/types';
import CheckedAuthenticatedPage from './Main/CheckedAuthenticatedPage';
import DetailPost from './Main/HomeTab/DetailPost';
import ProfileMenu from './Main/ProfileTab/ProfileMenu';
import SearchMenu from './Main/SearchTab/SearchMenu';
import Activity from './Main/Activity';
import { useAppTheme } from '../theme/ThemeProvider';
import { BodyText } from '../components/Typography';
import UserNameRequired from './Main/UserNameRequired';
import { FlashMessageProvider } from '../components/FlashMessage/FlashMessageProvider';
import { useAppSelector } from '../../store/redux/hooks';

const MainStack = createNativeStackNavigator<MainStackParamList>();
const MainTabsNavigator = createBottomTabNavigator<MainTabParamList>();
const HomeDrawer = createDrawerNavigator<HomeDrawerParamList>();
const HomeStack = createNativeStackNavigator<HomeMenuStackParamList>();

type DrawerItem = {
  route: keyof HomeDrawerParamList;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const DRAWER_ITEMS: DrawerItem[] = [
  { route: 'RecommandPost', label: '추천 스레드', icon: 'home' },
  { route: 'FollowingPost', label: '팔로잉 스레드', icon: 'people' },
  { route: 'LikedPost', label: '좋아요한 스레드', icon: 'heart' },
];

const HomeMenuDrawer: React.FC = () => {
  const { colors } = useAppTheme();
  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => (
      <HomeDrawerContent {...props} colors={colors} />
    ),
    [colors],
  );

  return (
    <HomeDrawer.Navigator
      id={undefined}
      initialRouteName="RecommandPost"
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'rgba(0,0,0,0.35)',
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
      }}
      drawerContent={renderDrawerContent}
    >
      <HomeDrawer.Screen name="RecommandPost" component={RecommandPost} />
      <HomeDrawer.Screen name="FollowingPost" component={FollowingPost} />
      <HomeDrawer.Screen name="LikedPost" component={LikedPost} />
    </HomeDrawer.Navigator>
  );
};

const HomeMenuNavigator: React.FC = () => (
  <HomeStack.Navigator
    id={undefined}
    initialRouteName="HomeDrawer"

  >
    <HomeStack.Screen name="HomeDrawer" component={HomeMenuDrawer} options={{headerShown:false}} />
    <HomeStack.Screen name="DetailPost" component={DetailPost} />
    <HomeStack.Screen name="DetailPostComment" component={DetailPost} />
    <HomeStack.Screen name="DetailPostNested" component={DetailPost} />
    <HomeStack.Screen name="NaviDetailPost" component={NaviDetailPost} />
    <HomeStack.Screen name="NaviDetailPostComment" component={NaviDetailPost} />
    <HomeStack.Screen
      name="ProfileMenu"
      component={ProfileMenu}
      options={{ headerShown: true, title: '프로필' }}
    />
  </HomeStack.Navigator>
);

// const SearchMenuNavigator: React.FC = () => (
//   <MainStack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
//     <MainStack.Screen name="SearchMenu" component={SearchMenu} />
//   </MainStack.Navigator>
// );

const MainTabs: React.FC = () => {
  const { colors, palette } = useAppTheme();
  const currentUser = useAppSelector((state) => state.loginUserInfo);

  const tabBarStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
    }),
    [colors.surface, colors.border],
  );

  const iconMap: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
    HomeTab: 'home',
    SearchTab: 'search',
    ActivityTab: 'notifications-outline',
    ProfileTab: 'person',
  };

  return (
    <MainTabsNavigator.Navigator
      id={undefined}
      screenOptions={({ route }): BottomTabNavigationOptions => ({
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: palette.themeColor,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const iconName = iconMap[route.name as keyof MainTabParamList];
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTabsNavigator.Screen
        name="HomeTab"
        component={HomeMenuNavigator}
        options={{ title: '' }}
      />
      <MainTabsNavigator.Screen
        name="SearchTab"
        component={SearchMenu}
        options={{ title: '' }}
      />
      <MainTabsNavigator.Screen
        name="ActivityTab"
        component={Activity}
        options={{ title: '' }}
      />
      <MainTabsNavigator.Screen
        name="ProfileTab"
        component={ProfileMenu}
          initialParams={{
          username: currentUser?.username || undefined,
        }}
        options={({ navigation }) => ({
          title: '',
        })}
      />
    </MainTabsNavigator.Navigator>
  );
};

type MainPageProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

const MainPage: React.FC<MainPageProps> = ({ route }) => {
  const initialScreen = route.params?.screen ?? 'CheckedAuthenticatedPage';

  return (
    <FlashMessageProvider>
      <MainStack.Navigator
        id={undefined}
        screenOptions={{ headerShown: false }}
        initialRouteName={initialScreen}
      >
        <MainStack.Screen
          name="CheckedAuthenticatedPage"
          component={CheckedAuthenticatedPage}
        />
        <MainStack.Screen name="UserNameRequired" component={UserNameRequired} />
        <MainStack.Screen name="Tabs" component={MainTabs} />
        <MainStack.Screen
          name="ProfileMenu"
          component={ProfileMenu}
          options={{ headerShown: true, title: '프로필' }}
        />
        <MainStack.Screen name="DetailPost" component={DetailPost} />
      </MainStack.Navigator>
    </FlashMessageProvider>
  );
};

export default MainPage;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  drawerScrollContainer: {
    flexGrow: 1,
    paddingTop: 48,
    paddingBottom: 24,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 12,
  },
  drawerHeader: {
    fontSize: 18,
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  drawerIcon: {
    marginRight: 12,
  },
});

type DrawerColors = ReturnType<typeof useAppTheme>['colors'];

type HomeDrawerContentProps = DrawerContentComponentProps & {
  colors: DrawerColors;
};

const HomeDrawerContent: React.FC<HomeDrawerContentProps> = ({
  colors,
  navigation,
  state,
  ...rest
}) => (
  <DrawerContentScrollView
    {...rest}
    contentContainerStyle={[styles.drawerScrollContainer, { backgroundColor: colors.surface }]}
  >
    <View style={styles.drawerContent}>
      <BodyText style={[styles.drawerHeader, { color: colors.textSecondary }]}>탐색</BodyText>
      {DRAWER_ITEMS.map((item) => {
        const isFocused = state.routeNames[state.index] === item.route;
        return (
          <Pressable
            key={item.route}
            onPress={() => {
              navigation.navigate(item.route);
              navigation.closeDrawer();
            }}
            style={({ pressed }) => [
              styles.drawerItem,
              {
                backgroundColor:
                  pressed || isFocused ? colors.card : 'transparent',
              },
            ]}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={colors.textPrimary}
              style={styles.drawerIcon}
            />
            <BodyText style={{ color: colors.textPrimary }}>{item.label}</BodyText>
          </Pressable>
        );
      })}
    </View>
  </DrawerContentScrollView>
);
