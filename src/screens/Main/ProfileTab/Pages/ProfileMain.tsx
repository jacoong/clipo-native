import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { fetchedUserInfo, typeOfFilter } from '@clipo/core';

import { useAppTheme } from '../../../../theme/ThemeProvider';
import { useAppSelector } from '../../../../../store/redux/hooks';
import { SocialService } from '../../../../../store/ApiService';
import PageNationStandard from '../../../../components/InfinityScroll/PageNationStandard';
import ProfileContainer from '../../../../components/ProfileContainer';
import ButtonComponent from '../../../../components/ButtonComponent';
import LoadingIndicator from '../../../../components/LoadingIndicator';
import NoNumberLoad from '../../../../components/NoNumberLoad';
import useFlashMessage from '../../../../hooks/useFlashMessage';
import type { ProfileStackParamList } from '../../../../navigation/types';
import { returnDefaultProfielColor } from '../../../../../store/exportFunctionFolder';
import useModal from '~/src/hooks/useModal';
const FILTERS: typeOfFilter[] = ['Post', 'Replies', 'Likes'];
const FILTER_LABELS: Record<'Post' | 'Replies' | 'Likes', string> = {
  Post: 'Post',
  Replies: 'Replies',
  Likes: 'Likes',
};



const returnDefaultBackgroundColor = (value: string | null | undefined) => {
  if (!value) {
    return '#1f2937';
  }
   const num = Number.parseInt(value.replace('bg_default_', ''), 10);
  switch (num) {
    case 1:

      return '#2563eb';
    case 2:

      return '#4b5563';
    case 3:

      return '#111827';
    case 4:

      return '#7c3aed';
    case 5:
      return '#059669';
    default:
      return '#1f2937';
  }
};

const ProfileMain: React.FC = () => {
  const { colors, palette } = useAppTheme();
  const loginUser = useAppSelector((state) => state.loginUserInfo);
  const { showMessage } = useFlashMessage();
  const route = useRoute<RouteProp<ProfileStackParamList, 'ProfileMain'>>();
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { openModal, closeModal } = useModal();
  const usernameParam = route.params?.username;
  const resolvedUsername =
    usernameParam ?? loginUser?.username ?? loginUser?.nickName ?? '';

  if (!resolvedUsername) {
    return (
        <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.missingWrapper}>
          <Ionicons name="alert-circle-outline" size={48} color={palette.themeColor} />
          <Text style={[styles.missingTitle, { color: colors.textPrimary }]}>
            사용자를 찾을 수 없습니다
          </Text>
          <Text style={[styles.missingSubtitle, { color: colors.textSecondary }]}>
            존재하지 않는 사용자이거나 접근 권한이 없어요.
          </Text>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.missingButton, { backgroundColor: palette.themeColor }]}
          >
            <Text style={[styles.missingButtonLabel, { color: palette.customRealWhite }]}>
              돌아가기
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const [selectedFilter, setSelectedFilter] = useState<typeOfFilter>('Post');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const {
    data: profileData,
    isLoading,
    isError,
    refetch,
  } = useQuery<fetchedUserInfo>({
    queryKey: ['profileInfo', resolvedUsername],
    enabled: resolvedUsername.length > 0,
    queryFn: async () => {
      const response = await SocialService.fetchedUserInfo(resolvedUsername);
      const body =
        response?.data?.body ?? response?.data ?? response?.body ?? response;
      return body as fetchedUserInfo;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (profileData) {
      setIsFollowing(Boolean(profileData.isFollowing));
      setFollowerCount(profileData.followerNumber ?? 0);
    }
  }, [profileData]);

  const isOwner = useMemo(() => {
    if (!profileData || !loginUser) {
      return false;
    }
    return profileData.nickName === loginUser.nickName;
  }, [loginUser, profileData]);


    const handleEditProfile = useCallback(() => {
    openModal('fullScreen', {
      title: '프로필 편집하기',
      // renderContent: () => <>sss</>
    });
  }, [closeModal, openModal]);

  const handleToggleFollow = useCallback(async () => {
    if (!profileData || followLoading) {
      return;
    }
    try {
      setFollowLoading(true);
      if (isFollowing) {
        await SocialService.unFolowUserAccount(profileData.nickName);
        setIsFollowing(false);
        setFollowerCount((prev) => Math.max(0, prev - 1));
        showMessage({
          type: 'success',
          title: '언팔로우 완료',
          description: `${profileData.nickName}님의 소식을 더 이상 받지 않아요.`,
        });
      } else {
        await SocialService.folowUserAccount(profileData.nickName);
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
        showMessage({
          type: 'success',
          title: '팔로우 완료',
          description: `${profileData.nickName}님의 새 소식을 받아요.`,
        });
      }
    } catch (error) {
      showMessage({
        type: 'error',
        title: '요청 실패',
        description: '잠시 후 다시 시도해 주세요.',
      });
    } finally {
      setFollowLoading(false);
    }
  }, [followLoading, isFollowing, profileData, showMessage]);

  const counts = useMemo(
    () => ({
      follower: followerCount,
      following: profileData?.followingNumber ?? 0,
    }),
    [followerCount, profileData?.followingNumber],
  );


    
  const emptyStateComponent = useMemo(() => {
    const map: Record<'Post' | 'Replies' | 'Likes', { title: string; description: string; icon: React.ReactNode }> =
      {
        Post: {
          title: '게시물이 없어요',
          description: '첫 게시물을 작성해보세요.',
          icon: <Ionicons name="document-text-outline" size={56} color={palette.themeColor} />,
        },
        Replies: {
          title: '답글이 없어요',
          description: '대화에 참여해보세요.',
          icon: <Ionicons name="chatbubble-ellipses-outline" size={56} color={palette.themeColor} />,
        },
        Likes: {
          title: '좋아요한 게시물이 없어요',
          description: '마음에 드는 게시물에 좋아요를 눌러보세요.',
          icon: <Ionicons name="heart-outline" size={56} color={palette.themeColor} />,
        },
      };

    const payload = map[selectedFilter as 'Post' | 'Replies' | 'Likes'];
    return (
      <NoNumberLoad
        icon={payload.icon}
        title={payload.title}
        description={payload.description}
      />
    );
  }, [palette.themeColor, selectedFilter]);

  const headerComponent = useMemo(() => {
    if (!profileData) {
      return null;
    }


    const backgroundImage = profileData?.backgroundPicture ?? 'bg_default_1';
    const profileImage = profileData?.profilePicture ?? 'default_1';
    const isDefaultBackgroundImage = backgroundImage?.startsWith('bg_default_');
    const isDefaultImage = profileImage?.startsWith('default_');

    return (
      <View>
        <View style={styles.headerContainer}>
          <View style={styles.coverContainer}>
            {!isDefaultBackgroundImage ? (
              <Image source={{ uri: profileData.backgroundPicture }} style={styles.coverImage} />
            ) : (
              <View style={[styles.coverFallback, { backgroundColor: returnDefaultBackgroundColor(backgroundImage) }]} />
            )}
          </View>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              <View style={styles.contentWrapper}>
              {isDefaultImage ? (
                <View style={styles.defaultCover}>
                   <Ionicons style={styles.defaultIcon} name="person-circle-outline" size={85} color={returnDefaultProfielColor(profileImage)} />
                </View>
               
              ) : (
                <Image source={{ uri: profileImage }} style={styles.coverImage} />
              )}
              </View>
            </View>
            {isOwner ? (
              <Pressable
                onPress={handleEditProfile}
                style={[styles.editButton, { backgroundColor: palette.themeColor }]}
              >
                <Text style={[styles.editButtonLabel, { color: palette.customRealWhite }]}>
                  프로필 편집
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleToggleFollow}
                disabled={followLoading}
                style={[
                  styles.followButton,
                  {
                    borderColor: palette.themeColor,
                    backgroundColor: isFollowing ? palette.customRealWhite : palette.themeColor,
                  },
                ]}
              >
                {followLoading ? (
                  <ActivityIndicator size="small" color={isFollowing ? palette.themeColor : palette.customRealWhite} />
                ) : (
                  <Text
                    style={[
                      styles.followButtonLabel,
                      { color: isFollowing ? palette.themeColor : palette.customRealWhite },
                    ]}
                  >
                    {isFollowing ? '팔로잉' : '팔로우'}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.infoBlock}>
          <Text style={[styles.displayName, { color: colors.textPrimary }]}>
            {profileData.nickName ?? resolvedUsername}
          </Text>
          {profileData.nickName ? (
            <Text style={[styles.email, { color: colors.textSecondary }]}>@{profileData.nickName}</Text>
          ) : null}
          {profileData.description ? (
            <Text style={[styles.description, { color: colors.textPrimary }]}>{profileData.description}</Text>
          ) : null}
        </View>

        <View style={styles.countRow}>
          <View style={styles.countItem}>
            <Text style={[styles.countNumber, { color: colors.textPrimary }]}>{counts.follower}</Text>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>Followers</Text>
          </View>
          <View style={styles.countItem}>
            <Text style={[styles.countNumber, { color: colors.textPrimary }]}>{counts.following}</Text>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>Following</Text>
          </View>
        </View>

        <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
          {FILTERS.map((filter) => {
            const isActive = filter === selectedFilter;
            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={styles.filterButton}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    { color: isActive ? colors.textPrimary : colors.textSecondary },
                  ]}
                >
                  {FILTER_LABELS[filter as 'Post' | 'Replies' | 'Likes']}
                </Text>
                <View
                  style={[
                    styles.filterIndicator,
                    { backgroundColor: isActive ? palette.themeColor : 'transparent' },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }, [
    colors.border,
    colors.textPrimary,
    colors.textSecondary,
    counts.follower,
    counts.following,
    handleEditProfile,
    handleToggleFollow,
    followLoading,
    isFollowing,
    isOwner,
    palette.customRealWhite,
    palette.themeColor,
    profileData,
    resolvedUsername,
    selectedFilter,
  ]);

  if (isLoading) {
    return (
      <View style={styles.loaderWrapper}>
        <LoadingIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          프로필 정보를 불러오지 못했습니다.
        </Text>
        <ButtonComponent label="다시 시도" onPress={() => refetch()} style={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <PageNationStandard
        typeOfFilter={selectedFilter}
        username={resolvedUsername}
        headerComponent={headerComponent}
        emptyStateComponent={emptyStateComponent}
      />
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    missingWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
      gap: 12,
    },
    missingTitle: {
      fontSize: 18,
      fontWeight: '700',
    },
    missingSubtitle: {
      fontSize: 14,
      textAlign: 'center',
    },
    missingButton: {
      marginTop: 8,
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 24,
    },
    missingButtonLabel: {
      fontSize: 15,
      fontWeight: '600',
    },
    loaderWrapper: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    errorText: {
      fontSize: 16,
      textAlign: 'center',
    },
    headerContainer: {
      paddingBottom: 16,
    },
    coverContainer: {
      height: 160,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      overflow: 'hidden',
    },
    coverImage: {
      width: 48,
      height: 48,
    },
    defaultCover:{
      position:'absolute',
      width: '100%',
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface
    },
    coverFallback: {
      flex: 1,
    },
    avatarRow: {
      height: 48,
      width:'100%',
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop:  10,
      // marginTop: -48,
    },
    contentWrapper: {
      position:'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    defaultIcon: {
      flexShrink: 0,
    },
    avatarWrapper: {
      width: 96,
      height: 96,
      marginTop: -48,
      position:'relative',
      borderRadius: 48,
      borderWidth: 4,
      borderColor: '#fff',
      overflow: 'hidden',
    },
    infoBlock: {
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 6,
    },
    displayName: {
      fontSize: 22,
      fontWeight: '700',
    },
    email: {
      fontSize: 15,
    },
    description: {
      fontSize: 15,
      lineHeight: 20,
    },
    countRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 24,
    },
    countItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    countNumber: {
      fontSize: 16,
      fontWeight: '700',
    },
    countLabel: {
      fontSize: 14,
    },
    filterRow: {
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    filterButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
    },
    filterLabel: {
      fontSize: 15,
      fontWeight: '600',
    },
    filterIndicator: {
      marginTop: 6,
      height: 3,
      width: '60%',
      borderRadius: 999,
      backgroundColor: 'transparent',
    },
    editButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 24,
    },
    editButtonLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
    followButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
    },
    followButtonLabel: {
      fontSize: 14,
      fontWeight: '700',
    },
  });

export default ProfileMain;
