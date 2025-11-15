import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAppTheme } from '../../../theme/ThemeProvider';
import { ThemedButton } from '../../../components/ThemedButton';
import { BodyText, H3 } from '../../../components/Typography';
import PageNationStandard from '../../../components/InfinityScroll/PageNationStandard';
import type { userPost } from '@clipo/core';
import {
  type HomeDrawerParamList,
  type HomeMenuStackParamList,
} from '../../../navigation/types';
import useModal from '../../../hooks/useModal';
import CreatePostReNew from '../../../components/Modal/Components/CreatePostReNew';
import { useAppSelector } from '../../../../store/redux/hooks';
import ProfileContainer from '../../../components/ProfileContainer';

export interface typeValue  {
  type:'Recommand'|'SavedPost'|'FollowingPost'|'LikePost';
  label:string
}

type HomeMenuProps = {
  value: typeValue;
  actionLabel?: string;
  activeTab?: 'home' | 'search' | 'favorites';
};

const HomeMenu: React.FC<HomeMenuProps> = ({
  value,
  actionLabel = '게시',
  activeTab = 'home',
}) => {
  const { colors, palette } = useAppTheme();
  const { openModal, closeModal } = useModal();
  const loginUser = useAppSelector((state) => state.loginUserInfo);
  type HomeMenuNavigation = CompositeNavigationProp<
    DrawerNavigationProp<HomeDrawerParamList>,
    NativeStackNavigationProp<HomeMenuStackParamList>
  >;

  const navigation = useNavigation<HomeMenuNavigation>();
  const logoImage = require('../../../../assets/images/logo3.png');
  const styles = useMemo(
    () =>
      createStyles({
        colors,
        palette,
      }),
    [colors, palette],
  );

  const navigateToDetailPage = useCallback(
    (post: userPost) => {
      console.log(post)
      const bno = post?.bno;
      if (!bno) {
        console.log('no bno')
        return;
      }

      navigation.navigate('DetailPost', {
        username: post.nickName,
        bno: String(post.bno),
      });
    },
    [navigation],
  );

  const handleComposePress = useCallback(() => {
    openModal('fullScreen', {
      title: '새로운 스레드',
      leftActionLabel: '취소',
      renderContent: () => <CreatePostReNew onRequestClose={closeModal} />,
    });
  }, [closeModal, openModal]);

  const pageKey = `${value.type}-${activeTab}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.openDrawer()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Open navigation menu"
        >
          <Ionicons
            name="menu"
            size={24}
            color={colors.textPrimary}
          />
        </Pressable>
        <View style={styles.logoWrapper}>
          {
            value.type === 'Recommand'?
                    <View style={styles.sectionHeader}>
            <Image source={logoImage} style={styles.headerLogo} />
            </View>:
        <View style={styles.sectionHeader}>
          <H3>{value.label}</H3>
        </View>
          }

        </View>
        <View style={styles.headerSpacer} />
      </View>

      <Pressable
        style={styles.composeRow}
        onPress={handleComposePress}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="새로운 스레드 작성"
      >
        <ProfileContainer
          nickName={loginUser?.nickName ?? 'Guest'}
          profileImg={loginUser?.profilePicture}
          size={44}
          isClickable={false}
        />
        <View style={styles.composeTextWrapper}>
          <BodyText style={styles.composePlaceholder}>
            {loginUser?.nickName
              ? `${loginUser.nickName}님, 스레드를 시작해보세요`
              : '스레드를 시작하세요...'}
          </BodyText>
          {loginUser?.username ? (
            <BodyText style={styles.composeSubtext}>
              @{loginUser.username}
            </BodyText>
          ) : null}
        </View>
        <ThemedButton
          label={actionLabel}
          variant="primary"
          onPress={handleComposePress}
          style={{ paddingHorizontal: 16 }}
        />
      </Pressable>
      <PageNationStandard
        key={pageKey}
        typeOfFilter='MainRandom'
        onPressPost={navigateToDetailPage}
      />
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  palette,
}: {
  colors: ReturnType<typeof useAppTheme>['colors'];
  palette: ReturnType<typeof useAppTheme>['palette'];
}) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      borderBottomColor:colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 20,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.background,
    },
    logoWrapper: {
      flexDirection: 'row',
      alignItems: 'center',

    },
    logoMark: {
      width: 20,
      height: 20,
      borderRadius: 4,
      backgroundColor: palette.themeColor,
    },
    headerLogo: {
      width: 120,
      height: 36,
      resizeMode: 'contain',
    },
    headerSpacer: {
      width: 24,
    },
    scroll: {
      flex: 1,
    },
    composeRow: {
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
   composeTextWrapper: {
      flex: 1,
      marginLeft: 12,
    },
    composePlaceholder: {
      fontSize: 15,
      color: colors.textPrimary,
    },
    composeSubtext: {
      marginTop: 4,
      fontSize: 12,
      color: colors.textSecondary,
    },
    sectionHeader: {
      height: 26,
      justifyContent: 'center',
      marginHorizontal: 16,
      marginVertical: 8,
    },
   
});

export default HomeMenu;
