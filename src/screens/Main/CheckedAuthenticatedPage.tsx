import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '@clipo/core';

import { useAppTheme } from '../../theme/ThemeProvider';
import { BodyText, H1 } from '../../components/Typography';
import { MainStackParamList } from '../../navigation/types';
import { UserService } from '../../../store/ApiService';
import { useAppDispatch } from '../../../store/redux/hooks';
import { setUserInfo, clearUserInfo } from '../../../store/redux/loginUserInfoSlice';
import LoadingIndicator from '../../components/LoadingIndicator';
import ButtonComponent from '../../components/ButtonComponent';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';

const CheckedAuthenticatedPage: React.FC = () => {
  const { colors, palette } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery<UserInfo>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await UserService.getUserProfile();
      return (response?.body ?? response) as UserInfo;
    },
  });

  useEffect(() => {
    if (!profileData) {
      return;
    }

    const hasNickname = Boolean(profileData.nickName);

    if (hasNickname) {
      dispatch(setUserInfo(profileData));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'UserNameRequired' }],
        }),
      );
    }
  }, [dispatch, navigation, profileData]);

  useEffect(() => {
    if (isError) {
      dispatch(clearUserInfo());
    }
  }, [dispatch, isError]);


  const backToMainPage = ()=>{
    const rootNavigation = navigation.getParent();
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Home',
                state: {
                  index: 0,
                  routes: [
                    {
                      name: 'Login'
                    },
                  ],
                },
              },
            ],
          });
       if (rootNavigation) {
        rootNavigation.dispatch(resetAction);
      } else {
        navigation.dispatch(resetAction);
      }
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.navBar}>
        <Pressable
          onPress={()=>backToMainPage()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          style={styles.navButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.messageBlock}>
          <H1 style={{ textAlign: 'center' }}>로그인 확인 중</H1>
          <BodyText style={{ textAlign: 'center', color: colors.textSecondary }}>
            서비스 이용을 위해 사용자 정보를 불러오고 있어요.
          </BodyText>
        </View>
        {!isError && isLoading ?<LoadingIndicator style={{ marginVertical: 20 }} />:null}
        {isError && (
          <View style={styles.errorBlock}>
            <BodyText style={{ textAlign: 'center', color: palette.customRed }}>
              정보를 불러오지 못했어요. 다시 시도해 주세요.
            </BodyText>
            <ButtonComponent
              label="다시 시도"
              variant="primary"
              onPress={() => refetch()}
              style={{ alignSelf: 'center', marginTop: 12 }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  navButton: {
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
    gap: 24,
  },
  messageBlock: {
    gap: 12,
  },
  errorBlock: {
    gap: 8,
  },
});

export default CheckedAuthenticatedPage;
