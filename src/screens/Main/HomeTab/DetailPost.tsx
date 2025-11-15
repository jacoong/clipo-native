import React, { useLayoutEffect, useMemo } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import type { userPost } from '@clipo/core';

import { useAppTheme } from '../../../theme/ThemeProvider';
import LoadingIndicator from '../../../components/LoadingIndicator';
import NoNumberLoad from '../../../components/NoNumberLoad';
import PostItem from '../../../components/Posts/PostItem';
import PageNationStandard from '../../../components/InfinityScroll/PageNationStandard';
import { SocialService } from '../../../../store/ApiService';
import type { HomeMenuStackParamList } from '../../../navigation/types';

type DetailPostRoute = RouteProp<HomeMenuStackParamList, 'DetailPost'>;
type DetailPostNavigation = NativeStackNavigationProp<HomeMenuStackParamList, 'DetailPost'>;

const extractPost = (payload: any): userPost | undefined => {
  if (!payload) {
    return undefined;
  }
  if (payload.body) {
    return extractPost(payload.body);
  }
  if (payload.data) {
    return extractPost(payload.data);
  }
  return payload as userPost;
};

const DetailPost: React.FC = () => {
  const { colors, mode } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const route = useRoute<DetailPostRoute>();
  const navigation = useNavigation<DetailPostNavigation>();
  const { bno, username } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `@${username}`,
    });
  }, [navigation, username]);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<userPost | undefined>({
    queryKey: ['fetchDetailBoardInfo', bno],
    queryFn: async () => {
      const response = await SocialService.fetchedBoard(bno);
      console.log(response.data.body,'aaaa')
      return extractPost(response?.data ?? response);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <LoadingIndicator />
      </View>
    );
  }

  if (isError || !post) {
    return (
      <View style={styles.center}>
        <NoNumberLoad
          title="게시물을 불러오지 못했습니다."
          description="잠시 후 다시 시도해주세요."
          icon={<Ionicons name="warning-outline" size={40} color={colors.textSecondary} />}
        />
      </View>
    );
  }

  const numericBno = post.bno ?? Number(bno);

  return (
    <View style={styles.container}>
        <View>
          <View>
         <PostItem postInfo={post} isDetailPost />
          </View>
         
       </View>
       

      <View style={styles.replyWrapper}>
        {post.isReplyAllowed ? (
          <PageNationStandard typeOfFilter="Reply" bno={numericBno} />
        ) : (
          <View style={styles.center}>
            <NoNumberLoad
              title="댓글이 중지되었습니다"
              description={'이 게시물의 댓글 작성이 중지되었습니다.\n다른 게시물을 확인해보세요.'}
              icon={
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={42}
                  color={colors.textSecondary}
                />
              }
            />
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    postWrapper: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.surface,
    },
    replyWrapper: {
      flex: 1,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: colors.background,
    },
  });

export default DetailPost;
