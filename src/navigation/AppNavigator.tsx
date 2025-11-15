import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList, ValidateStackParamList, MainStackParamList } from './types';
import Home from '../screens/Home';
import MainPage from '../screens/MainPage';
import SocialLoginProcessPage from '../components/SocialLoginProcessPage';
import SmsRequest from '../screens/Home/SmsRequest';
import SmsAuthentication from '../screens/Home/SmsAuthentication';
import UsernamePage from '../components/UsernamePage';
import UpdatePassword from '../components/UpdatePassword';
import ConfirmPage from '../components/ConfirmPage';
import PageNotFound from '../components/PageNotFound';
import { initializeAuthTokens } from '../../store/axios_context';
import { useAppDispatch } from '../../store/redux/hooks';
import { setUserInfo, clearUserInfo } from '../../store/redux/loginUserInfoSlice';
import { UserService } from '../../store/ApiService';
import { UserInfo } from '@clipo/core';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const ValidateStack = createNativeStackNavigator<ValidateStackParamList>();

const linking = {
  prefixes: ['theclipo://', 'https://theclipo.app'],
  config: {
    initialRouteName: 'Home',
    screens: {
      Home: {
        path: '/',
        initialRouteName: 'Main',
        screens: {
          Main: '',
          Login: 'login',
          ForgetPassword: 'forget/password',
          EmailAuthentication: 'email/authentication',
          SocialLogin: 'socialLoginPage',
          Join: 'join',
          SmsRequest: 'sms/request',
          SmsAuthentication: 'sms/verify',
        },
      },
      SocialLoginProcess: 'auth/:typeOfPlatform',
      Validate: {
        path: 'validatePage',
        initialRouteName: 'SmsRequest',
        screens: {
          SmsRequest: '',
          SmsAuthentication: 'authentication',
        },
      },
      Username: 'enrollUsername',
      Main: {
        path: 'main',
        screens: {
          Tabs: {
            path: '',
            screens: {
              HomeTab: {
                path: '',
                screens: {
                  HomeDrawer: {
                    path: '',
                    screens: {
                      RecommandPost: '',
                      FollowingPost: 'followingPost',
                      LikedPost: 'likedPost',
                    },
                  },
                  DetailPost: '@/:username/post/:bno',
                  DetailPostComment: '@/:username/post/:bno/comment/:rno',
                  DetailPostNested:
                    '@/:username/post/:bno/comment/:rno/nestRe/:nestRe',
                  NaviDetailPost: '@/post/:bno',
                  NaviDetailPostComment: '@/post/:bno/comment/:rno',
                },
              },
              SearchTab: {
                path: 'search',
                screens: {
                  SearchMain: '',
                  SearchResultPage: 'type/:typeOfFilter',
                  TagsPost: 'tags/post/:tagValue',
                },
              },
              ActivityTab: {
                path: 'activity',
                screens: {
                  ActivityMain: '',
                },
              },
              ProfileTab: 'profile/:username',
            },
          },
          ProfileMenu: '@/:username',
          DetailPost: '@/:username/post/:bno',
          DetailPostComment: '@/:username/post/:bno/comment/:rno',
          DetailPostNested:
            '@/:username/post/:bno/comment/:rno/nestRe/:nestRe',
          NaviDetailPost: '@/post/:bno',
          NaviDetailPostComment: '@/post/:bno/comment/:rno',
        },
      },
      UpdatePassword: 'updatePassword',
      Confirm: 'Confirm',
      NotFound: '*',
    },
  },
} satisfies LinkingOptions<RootStackParamList>;

function ValidateNavigator() {
  return (
    <ValidateStack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}
    >
      <ValidateStack.Screen name="SmsRequest" component={SmsRequest} />
      <ValidateStack.Screen name="SmsAuthentication" component={SmsAuthentication} />
    </ValidateStack.Navigator>
  );
}

export default function AppNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Home');
  const [initialMainScreen, setInitialMainScreen] = useState<keyof MainStackParamList>('CheckedAuthenticatedPage');
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;
    const prepare = async () => {
      try {
        const tokens = await initializeAuthTokens();
        if (!cancelled) {
          if (!tokens.accessToken) {
            dispatch(clearUserInfo());
            setInitialRoute('Home');
            setInitialMainScreen('CheckedAuthenticatedPage');
            return;
          }

          try {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            if (cancelled) {
              return;
            }
            const response = await UserService.getUserProfile();
            if (cancelled) {
              return;
            }
            const profile = (response?.body ?? response) as UserInfo;
            if (profile?.nickName) {
              dispatch(setUserInfo(profile));
              setInitialRoute('Main');
              setInitialMainScreen('Tabs');
            } else {
              setInitialRoute('Main');
              setInitialMainScreen('UserNameRequired');
            }
          } catch {
            if (!cancelled) {
              dispatch(clearUserInfo());
              setInitialRoute('Home');
              setInitialMainScreen('CheckedAuthenticatedPage');
            }
          }
        }
      } catch {
        if (!cancelled) {
          dispatch(clearUserInfo());
          setInitialRoute('Home');
          setInitialMainScreen('CheckedAuthenticatedPage');
        }
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };
    prepare();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!isReady) {
    const logoImage = require('../../assets/images/logo3.png');
    return (
      <View style={styles.bootContainer}>
        <Image source={logoImage} style={styles.bootLogo} resizeMode="contain" />
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking} fallback={<PageNotFound />}>
      <RootStack.Navigator id={undefined} screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <RootStack.Screen
          name="Main"
          component={MainPage}
          key={`Main-${initialMainScreen}`}
          initialParams={{ screen: initialMainScreen }}
        />
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen
          name="SocialLoginProcess"
          component={SocialLoginProcessPage}
        />
        <RootStack.Screen name="Validate" component={ValidateNavigator} />
        <RootStack.Screen name="Username" component={UsernamePage} />
        <RootStack.Screen name="UpdatePassword" component={UpdatePassword} />
        <RootStack.Screen name="Confirm" component={ConfirmPage} />
        <RootStack.Screen name="NotFound" component={PageNotFound} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A0A',
    gap: 16,
  },
  bootLogo: {
    width: 120,
    height: 120,
  }
});
