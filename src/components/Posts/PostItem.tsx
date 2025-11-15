import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAppTheme } from '../../theme/ThemeProvider';
import { SocialService } from '../../..//store/ApiService';
import { CLIENTURL } from '../../../store/axios_context';
import { useAppSelector } from '../../../store/redux/hooks';
import ProfileContainer from '../ProfileContainer';
import PostTool, { PostToolDescriptor, ToolType } from './PostTool';
import type { userPost } from '@clipo/core';
import useModal from '../../hooks/useModal';
import useFlashMessage from '../../hooks/useFlashMessage';
import CreatePostReNew from '../Modal/Components/CreatePostReNew';
type InfinitePostsData = {
  pages?: Array<{
    body?: {
      data?: userPost[];
      [key: string]: any;
    };
    [key: string]: any;
  }>;
  [key: string]: any;
};

const PROFILE_FILTERS = ['Post', 'Replies', 'Likes'] as const;
type ProfileFilter = (typeof PROFILE_FILTERS)[number];

const SIMULATE_OPTIMISTIC_ERROR = true;

const simulateDelayedError = async () =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('시뮬레이션된 오류입니다.')), 3000),
  );

const adjustLikeCount = (count: number | undefined, isLike: boolean) =>
  Math.max(0, (count ?? 0) + (isLike ? 1 : -1));

const updateList = (
  oldData: InfinitePostsData | undefined,
  postId: number,
  isLike: boolean,
): InfinitePostsData | undefined => {
  if (!oldData?.pages) {
    return oldData;
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page) => {
      const body = page.body;
      if (!body?.data) {
        return page;
      }
      return {
        ...page,
        body: {
          ...body,
          data: body.data.map((post) =>
            post?.bno === postId
              ? {
                  ...post,
                  isLike,
                  numberOfLike: adjustLikeCount(post.numberOfLike, isLike),
                }
              : post,
          ),
        },
      };
    }),
  };
};

const updateDetail = (oldDetail: any, isLike: boolean) => {
  if (!oldDetail?.data?.body) {
    return oldDetail;
  }
  const { data } = oldDetail;
  const { body } = data;
  return {
    ...oldDetail,
    data: {
      ...data,
      body: {
        ...body,
        isLike,
        numberOfLike: adjustLikeCount(body.numberOfLike, isLike),
      },
    },
  };
};

const updateReplyList = (
  oldData: InfinitePostsData | undefined,
  replyId: number,
  isLike: boolean,
): InfinitePostsData | undefined => {
  if (!oldData?.pages) {
    return oldData;
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page) => {
      const body = page.body;
      if (!body?.data) {
        return page;
      }
      return {
        ...page,
        body: {
          ...body,
          data: body.data.map((post) =>
            post?.rno === replyId
              ? {
                  ...post,
                  isLike,
                  numberOfLike: adjustLikeCount(post.numberOfLike, isLike),
                }
              : post,
          ),
        },
      };
    }),
  };
};

const filterPostsFromList = (
  oldData: InfinitePostsData | undefined,
  predicate: (post: userPost | undefined) => boolean,
): InfinitePostsData | undefined => {
  if (!oldData?.pages) {
    return oldData;
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page) => {
      const body = page.body;
      if (!body?.data) {
        return page;
      }
      return {
        ...page,
        body: {
          ...body,
          data: body.data.filter(predicate),
        },
      };
    }),
  };
};

type OptimisticContext = {
  prevMain?: InfinitePostsData;
  prevDetail?: any;
  prevUserLists: Partial<Record<ProfileFilter, unknown>>;
  prevIsLiked: boolean;
  prevLikeCount: number;
};

type QuerySnapshot = {
  key: readonly unknown[];
  data: unknown;
};

type ReplyOptimisticContext = {
  snapshots: QuerySnapshot[];
  prevIsLiked: boolean;
  prevLikeCount: number;
};

type DeleteBoardContext = {
  prevMain?: InfinitePostsData;
  prevDetail?: any;
  prevUserLists: Partial<Record<ProfileFilter, unknown>>;
};

type DeleteReplyContext = {
  snapshots: QuerySnapshot[];
};

type PostItemProps = {
  postInfo: userPost;
  isDark?: boolean;
  isDetailPost?: boolean;
  onPressPost?: (post: userPost) => void;
  onPressComments?: (post: userPost) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  postInfo,
  isDetailPost = false,
  onPressPost,
  onPressComments,
}) => {
  const navigation = useNavigation<any>();
  const profileUsername = (postInfo as any)?.username ?? postInfo.nickName;
  const { colors, palette, mode } = useAppTheme();
  const { openModal, closeModal } = useModal();
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state) => state.loginUserInfo);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const cardBackground = colors.background;
  const isDark = mode === 'dark';
  const { showMessage } = useFlashMessage();
  const [likeCount, setLikeCount] = useState(postInfo.numberOfLike ?? 0);
  const [isLiked, setIsLiked] = useState(postInfo.isLike ?? false);
  const commentCount = postInfo.numberOfComments ?? 0;
  const isPostOwner =
    Boolean(currentUser?.nickName) &&
    Boolean(postInfo.nickName) &&
    currentUser?.nickName === postInfo.nickName;
  const isBoardPost = postInfo.typeOfPost === 'board';

  const applyOptimisticUpdate = useCallback(
    async (postId: number, nextIsLike: boolean): Promise<OptimisticContext> => {
      await queryClient.cancelQueries({ queryKey: ['fetchPosts', 'MainRandom'] });

      const prevMain = queryClient.getQueryData(['fetchPosts', 'MainRandom']) as
        | InfinitePostsData
        | undefined;
      const prevDetail = queryClient.getQueryData(['fetchDetailBoardInfo', postId]);
      const prevUserLists: Partial<Record<ProfileFilter, unknown>> = {};

      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) => {
          const key = ['fetchPosts', filter, postInfo.nickName] as const;
          prevUserLists[filter] = queryClient.getQueryData(key);
          queryClient.setQueryData(key, (oldData: InfinitePostsData | undefined) =>
            updateList(oldData, postId, nextIsLike),
          );
        });
      }

      queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldData: InfinitePostsData | undefined) =>
        updateList(oldData, postId, nextIsLike),
      );
      queryClient.setQueryData(['fetchDetailBoardInfo', postId], (oldDetail: any) =>
        updateDetail(oldDetail, nextIsLike),
      );

      setIsLiked(nextIsLike);
      setLikeCount((prev) => Math.max(0, prev + (nextIsLike ? 1 : -1)));

      return {
        prevMain,
        prevDetail,
        prevUserLists,
        prevIsLiked: isLiked,
        prevLikeCount: likeCount,
      };
    },
    [isLiked, likeCount, postInfo.nickName, queryClient],
  );

  const applyReplyOptimisticUpdate = useCallback(
    async (replyId: number, nextIsLike: boolean): Promise<ReplyOptimisticContext> => {
      const snapshots: QuerySnapshot[] = [];
      const captureAndUpdate = (
        key: readonly unknown[],
        updater: (oldData: InfinitePostsData | undefined) => InfinitePostsData | undefined,
      ) => {
        const previous = queryClient.getQueryData(key);
        snapshots.push({ key, data: previous });
        queryClient.setQueryData(key, updater);
      };

      if (postInfo.bno) {
        captureAndUpdate(['fetchPosts', 'Reply', postInfo.bno], (oldData) =>
          updateReplyList(oldData, replyId, nextIsLike),
        );
      }

      if (postInfo.parentRno != null) {
        captureAndUpdate(['fetchPosts', 'NestRe', postInfo.parentRno], (oldData) =>
          updateReplyList(oldData, replyId, nextIsLike),
        );
      }

      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) => {
          captureAndUpdate(['fetchPosts', filter, postInfo.nickName], (oldData) =>
            updateReplyList(oldData, replyId, nextIsLike),
          );
        });
      }

      const context: ReplyOptimisticContext = {
        snapshots,
        prevIsLiked: isLiked,
        prevLikeCount: likeCount,
      };

      setIsLiked(nextIsLike);
      setLikeCount((prev) => Math.max(0, prev + (nextIsLike ? 1 : -1)));

      return context;
    },
    [isLiked, likeCount, postInfo.bno, postInfo.nickName, postInfo.parentRno, queryClient],
  );

  const rollbackOptimisticUpdate = useCallback(
    (postId: number, context?: OptimisticContext) => {
      if (!context) {
        return;
      }
      queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevMain);
      queryClient.setQueryData(['fetchDetailBoardInfo', postId], context.prevDetail);

      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) => {
          const previous = context.prevUserLists?.[filter];
          if (previous !== undefined) {
            queryClient.setQueryData(['fetchPosts', filter, postInfo.nickName], previous);
          }
        });
      }

      setIsLiked(context.prevIsLiked);
      setLikeCount(context.prevLikeCount);
    },
    [postInfo.nickName, queryClient],
  );

  const rollbackReplyOptimisticUpdate = useCallback(
    (context?: ReplyOptimisticContext) => {
      if (!context) {
        return;
      }

      context.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });

      setIsLiked(context.prevIsLiked);
      setLikeCount(context.prevLikeCount);
    },
    [queryClient],
  );

  const { mutate: triggerLike, isPending: isLikePending } = useMutation<
    unknown,
    unknown,
    number,
    OptimisticContext
  >({
    mutationFn: async (id: number) => {
      if (__DEV__ && SIMULATE_OPTIMISTIC_ERROR && postInfo.typeOfPost === 'board') {
        await simulateDelayedError();
      }
      return SocialService.boardlikeContents(id);
    },
    onMutate: (postId: number) => applyOptimisticUpdate(postId, true),
    onError: (_error, postId, context) => {
      rollbackOptimisticUpdate(postId, context);
      Alert.alert('오류', '좋아요에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'LikedUser', postId] });
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'MainRandom'] });
      queryClient.invalidateQueries({ queryKey: ['fetchDetailBoardInfo', postId] });
      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) => {
          queryClient.invalidateQueries({
            queryKey: ['fetchPosts', filter, postInfo.nickName],
          });
        });
      }
    },
  });

  const { mutate: triggerUnlike, isPending: isUnlikePending } = useMutation<
    unknown,
    unknown,
    number,
    OptimisticContext
  >({
    mutationFn: async (id: number) => {
      if (__DEV__ && SIMULATE_OPTIMISTIC_ERROR && postInfo.typeOfPost === 'board') {
        await simulateDelayedError();
      }
      return SocialService.boardunlikeContents(id);
    },
    onMutate: (postId: number) => applyOptimisticUpdate(postId, false),
    onError: (_error, postId, context) => {
      rollbackOptimisticUpdate(postId, context);
      Alert.alert('오류', '좋아요를 취소하지 못했습니다. 잠시 후 다시 시도해주세요.');
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'LikedUser', postId] });
    },
    onSettled: (_data, _error, postId) => {
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'MainRandom'] });
      queryClient.invalidateQueries({ queryKey: ['fetchDetailBoardInfo', postId] });
      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) => {
          queryClient.invalidateQueries({
            queryKey: ['fetchPosts', filter, postInfo.nickName],
          });
        });
      }
    },
  });

  const invalidateReplyRelatedQueries = useCallback(() => {
    if (postInfo.bno) {
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'Reply', postInfo.bno] });
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'LikedUser', postInfo.bno] });
    }
    if (postInfo.parentRno != null) {
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'NestRe', postInfo.parentRno] });
    }
    if (postInfo.nickName) {
      PROFILE_FILTERS.forEach((filter) =>
        queryClient.invalidateQueries({ queryKey: ['fetchPosts', filter, postInfo.nickName] }),
      );
    }
  }, [postInfo.bno, postInfo.nickName, postInfo.parentRno, queryClient]);

  const { mutate: triggerReplyLike, isPending: isReplyLikePending } = useMutation<
    unknown,
    unknown,
    number,
    ReplyOptimisticContext
  >({
    mutationFn: async (rno: number) => {
      if (__DEV__ && SIMULATE_OPTIMISTIC_ERROR && postInfo.typeOfPost !== 'board') {
        await simulateDelayedError();
      }
      return SocialService.replylikeContents(rno);
    },
    onMutate: (replyId: number) => applyReplyOptimisticUpdate(replyId, true),
    onError: (_error, _replyId, context) => {
      rollbackReplyOptimisticUpdate(context);
      Alert.alert('오류', '좋아요에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
    onSettled: () => {
      invalidateReplyRelatedQueries();
    },
  });

  const { mutate: triggerReplyUnlike, isPending: isReplyUnlikePending } = useMutation<
    unknown,
    unknown,
    number,
    ReplyOptimisticContext
  >({
    mutationFn: async (rno: number) => {
      if (__DEV__ && SIMULATE_OPTIMISTIC_ERROR && postInfo.typeOfPost !== 'board') {
        await simulateDelayedError();
      }
      return SocialService.replyunlikeContents(rno);
    },
    onMutate: (replyId: number) => applyReplyOptimisticUpdate(replyId, false),
    onError: (_error, _replyId, context) => {
      rollbackReplyOptimisticUpdate(context);
      Alert.alert('오류', '좋아요를 취소하지 못했습니다. 잠시 후 다시 시도해주세요.');
    },
    onSettled: () => {
      invalidateReplyRelatedQueries();
    },
  });

  const { mutate: deleteBoardMutation, isPending: isDeletingBoard } = useMutation<
    unknown,
    unknown,
    number,
    DeleteBoardContext
  >({
    mutationFn: async (bno: number) => {
      if (__DEV__ && SIMULATE_OPTIMISTIC_ERROR && postInfo.typeOfPost === 'board') {
        await simulateDelayedError();
      }
      return SocialService.deleteBoardRequest(String(bno));
    },
    onMutate: async (bno: number) => {
      closeModal();
      showMessage({
        type: 'brand',
        title: '삭제 진행 중',
        description: '게시물을 삭제하고 있어요.',
      });
      await queryClient.cancelQueries({ queryKey: ['fetchPosts', 'MainRandom'] });

      const prevMain = queryClient.getQueryData(['fetchPosts', 'MainRandom']) as
        | InfinitePostsData
        | undefined;
      const prevDetail = queryClient.getQueryData(['fetchDetailBoardInfo', bno]);
      const prevUserLists: Partial<Record<ProfileFilter, unknown>> = {};

      queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldData: InfinitePostsData | undefined) =>
        filterPostsFromList(oldData, (post) => post?.bno !== bno),
      );
      queryClient.setQueryData(['fetchDetailBoardInfo', bno], undefined);

      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) => {
          const key = ['fetchPosts', filter, postInfo.nickName] as const;
          prevUserLists[filter] = queryClient.getQueryData(key);
          queryClient.setQueryData(key, (oldData: InfinitePostsData | undefined) =>
            filterPostsFromList(oldData, (post) => post?.bno !== bno),
          );
        });
      }

      return { prevMain, prevDetail, prevUserLists };
    },
    onError: (_error, bno, context) => {
      if (context) {
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevMain);
        queryClient.setQueryData(['fetchDetailBoardInfo', bno], context.prevDetail);
        if (postInfo.nickName) {
          PROFILE_FILTERS.forEach((filter) => {
            const previous = context.prevUserLists[filter];
            if (previous !== undefined) {
              queryClient.setQueryData(['fetchPosts', filter, postInfo.nickName], previous);
            }
          });
        }
      }
      showMessage({
        type: 'error',
        title: '삭제 실패',
        description: '잠시 후 다시 시도해주세요.',
      });
    },
    onSuccess: () => {
      showMessage({
        type: 'success',
        title: '삭제 완료',
        description: '게시물을 삭제했습니다.',
      });
    },
    onSettled: (_data, _error, bno) => {
      queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'MainRandom'] });
      queryClient.invalidateQueries({ queryKey: ['fetchDetailBoardInfo', bno] });
      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) =>
          queryClient.invalidateQueries({
            queryKey: ['fetchPosts', filter, postInfo.nickName],
          }),
        );
      }
    },
  });

  const { mutate: deleteReplyMutation, isPending: isDeletingReply } = useMutation<
    unknown,
    unknown,
    number,
    DeleteReplyContext
  >({
    mutationFn: async (rno: number) => {
      if (__DEV__ && SIMULATE_OPTIMISTIC_ERROR && postInfo.typeOfPost !== 'board') {
        await simulateDelayedError();
      }
      return SocialService.deleteCommentRequest(String(rno));
    },
    onMutate: async (rno: number) => {
      closeModal();
      showMessage({
        type: 'brand',
        title: '삭제 진행 중',
        description: '댓글을 삭제하고 있어요.',
      });

      const snapshots: QuerySnapshot[] = [];
      const captureAndRemove = (
        key: readonly unknown[],
        predicate: (post: userPost | undefined) => boolean,
      ) => {
        const previous = queryClient.getQueryData(key);
        snapshots.push({ key, data: previous });
        queryClient.setQueryData(key, (oldData: InfinitePostsData | undefined) =>
          filterPostsFromList(oldData, predicate),
        );
      };

      if (postInfo.bno) {
        captureAndRemove(['fetchPosts', 'Reply', postInfo.bno], (post) => post?.rno !== rno);
      }
      if (postInfo.parentRno != null) {
        captureAndRemove(['fetchPosts', 'NestRe', postInfo.parentRno], (post) => post?.rno !== rno);
      }
      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) =>
          captureAndRemove(['fetchPosts', filter, postInfo.nickName], (post) => post?.rno !== rno),
        );
      }

      return { snapshots };
    },
    onError: (_error, _rno, context) => {
      context?.snapshots.forEach(({ key, data }) => {
        queryClient.setQueryData(key, data);
      });
      showMessage({
        type: 'error',
        title: '삭제 실패',
        description: '댓글 삭제에 실패했습니다.',
      });
    },
    onSuccess: () => {
      showMessage({
        type: 'success',
        title: '삭제 완료',
        description: '댓글을 삭제했습니다.',
      });
    },
    onSettled: (_data, _error, rno) => {
      if (postInfo.bno) {
        queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'Reply', postInfo.bno] });
      }
      if (postInfo.parentRno != null) {
        queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'NestRe', postInfo.parentRno] });
      }
      if (postInfo.bno) {
        queryClient.invalidateQueries({ queryKey: ['fetchDetailBoardInfo', postInfo.bno] });
      }
      if (postInfo.nickName) {
        PROFILE_FILTERS.forEach((filter) =>
          queryClient.invalidateQueries({
            queryKey: ['fetchPosts', filter, postInfo.nickName],
          }),
        );
      }
    },
  });

  const invalidatePostCaches = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['fetchPosts', 'MainRandom'] });
    if (postInfo.bno) {
      queryClient.invalidateQueries({ queryKey: ['fetchDetailBoardInfo', postInfo.bno] });
    }
    if (postInfo.nickName) {
      PROFILE_FILTERS.forEach((filter) =>
        queryClient.invalidateQueries({
          queryKey: ['fetchPosts', filter, postInfo.nickName],
        }),
      );
    }
  }, [postInfo.bno, postInfo.nickName, queryClient]);

  const { mutateAsync: followUserAsync } = useMutation({
    mutationFn: (nickname: string) => SocialService.folowUserAccount(nickname),
      onMutate: () => {
      closeModal();
      showMessage({
        type: 'brand',
        title: '삭제 진행 중',
        description: '댓글을 삭제하고 있어요.',
      });
    },
    onSuccess: () => {
      showMessage({
        type: 'success',
        title: '팔로우 완료',
        description: `${postInfo.nickName}님을 팔로우했습니다.`,
      });
      invalidatePostCaches();
    },
    onError: () => {
      showMessage({
        type: 'error',
        title: '팔로우 실패',
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });

  const { mutateAsync: unfollowUserAsync } = useMutation({
      onMutate: () => {
      closeModal();
      showMessage({
        type: 'brand',
        title: '삭제 진행 중',
        description: '댓글을 삭제하고 있어요.',
      });
    },
    mutationFn: (nickname: string) => SocialService.unFolowUserAccount(nickname),
    onSuccess: () => {
      showMessage({
        type: 'success',
        title: '언팔로우 완료',
        description: `${postInfo.nickName}님을 언팔로우했습니다.`,
      });
      invalidatePostCaches();
    },
    onError: () => {
      showMessage({
        type: 'error',
        title: '언팔로우 실패',
        description: '잠시 후 다시 시도해주세요.',
      });
    },
  });

  const { mutateAsync: updateLikeVisibilityAsync } = useMutation({
    mutationFn: ({ bno, nextValue }: { bno: number; nextValue: boolean }) => {
      const formData = new FormData();
      formData.append('bno', String(bno));
      formData.append('isLikeVisible', String(nextValue));
      return SocialService.modificateBoard(formData);
    },
    onSuccess: () => {
      Alert.alert('완료', '좋아요 공개 설정을 변경했습니다.');
    },
    onError: () => {
      Alert.alert('오류', '좋아요 공개 설정을 변경하지 못했습니다.');
    },
  });

  const { mutateAsync: updateCommentPermissionAsync } = useMutation({
    mutationFn: ({ bno, nextValue }: { bno: number; nextValue: boolean }) => {
      const formData = new FormData();
      formData.append('bno', String(bno));
      formData.append('isReplyAllowed', String(nextValue));
      return SocialService.modificateBoard(formData);
    },
    onSuccess: () => {
      Alert.alert('완료', '댓글 허용 설정을 변경했습니다.');
    },
    onError: () => {
      Alert.alert('오류', '댓글 허용 설정을 변경하지 못했습니다.');
    },
  });

  const handleToggleLike = useCallback(() => {
    if (postInfo.typeOfPost === 'board') {
      if (!postInfo.bno || isLikePending || isUnlikePending) {
        return;
      }
      if (isLiked) {
        triggerUnlike(postInfo.bno);
      } else {
        triggerLike(postInfo.bno);
      }
      return;
    }

    if (!postInfo.rno || isReplyLikePending || isReplyUnlikePending) {
      return;
    }

    if (isLiked) {
      triggerReplyUnlike(postInfo.rno);
    } else {
      triggerReplyLike(postInfo.rno);
    }
  }, [
    isLikePending,
    isReplyLikePending,
    isReplyUnlikePending,
    isUnlikePending,
    isLiked,
    postInfo.bno,
    postInfo.rno,
    postInfo.typeOfPost,
    triggerLike,
    triggerReplyLike,
    triggerReplyUnlike,
    triggerUnlike,
  ]);

  const handlePressComments = useCallback(() => {
    onPressComments?.(postInfo);
  }, [onPressComments, postInfo]);

  const handlePressPost = useCallback(() => {
    onPressPost?.(postInfo);
  }, [onPressPost, postInfo]);

  const handleComposeReply = useCallback(() => {
    if (!postInfo.bno && !postInfo.rno) {
      return;
    }
    const isBoard = postInfo.typeOfPost === 'board';
    openModal('fullScreen', {
      title: isBoard ? '댓글 작성' : '대댓글 작성',
      leftActionLabel: '취소',
      renderContent: () => (
        <CreatePostReNew
          type={isBoard ? 'reply' : 'nestRe'}
          bno={postInfo.bno}
          parentRno={isBoard ? undefined : postInfo.rno}
          replyTarget={{
            nickName: postInfo.nickName,
            username: (postInfo as any)?.username ?? postInfo.nickName,
            profilePicture: postInfo.profilePicture,
            contents: postInfo.contents,
            regData: postInfo.regData,
            typeOfPost: postInfo.typeOfPost,
          }}
          onRequestClose={closeModal}
        />
      ),
    });
  }, [closeModal, openModal, postInfo.bno, postInfo.rno, postInfo.typeOfPost]);

  const handleCopyLink = useCallback(() => {
    let shareUrl = `${CLIENTURL}main/@/${postInfo.nickName}`;
    if (postInfo.typeOfPost === 'board' && postInfo.bno) {
      shareUrl = `${CLIENTURL}main/@/${postInfo.nickName}/post/${postInfo.bno}`;
    } else if (postInfo.bno && postInfo.rno) {
      shareUrl = `${CLIENTURL}main/@/${postInfo.nickName}/post/${postInfo.bno}/comment/${postInfo.rno}`;
    }

    Share.share({
      message: shareUrl,
      url: shareUrl,
    }).catch(() => undefined);
  }, [postInfo.bno, postInfo.nickName, postInfo.rno, postInfo.typeOfPost]);

  const handleFollowUser = useCallback(() => {
    followUserAsync(postInfo.nickName);
  }, [followUserAsync, postInfo.nickName]);

  const handleUnfollowUser = useCallback(() => {
    unfollowUserAsync(postInfo.nickName);
  }, [postInfo.nickName, unfollowUserAsync]);

  const handleToggleLikeVisibility = useCallback(() => {
    if (!postInfo.bno) {
      Alert.alert('안내', '게시물 정보를 찾지 못했습니다.');
      return;
    }
    updateLikeVisibilityAsync({
      bno: postInfo.bno,
      nextValue: !postInfo.isLikeVisible,
    });
  }, [postInfo.bno, postInfo.isLikeVisible, updateLikeVisibilityAsync]);

  const handleToggleComments = useCallback(() => {
    if (!postInfo.bno) {
      Alert.alert('안내', '게시물 정보를 찾지 못했습니다.');
      return;
    }
    updateCommentPermissionAsync({
      bno: postInfo.bno,
      nextValue: !postInfo.isReplyAllowed,
    });
  }, [postInfo.bno, postInfo.isReplyAllowed, updateCommentPermissionAsync]);

  const handleConfirmDelete = useCallback(() => {
    const isBoardTarget = postInfo.typeOfPost === 'board';
    const targetId = isBoardTarget ? postInfo.bno : postInfo.rno;

    if (!targetId) {
      Alert.alert('안내', '삭제할 대상을 찾지 못했습니다.');
      return;
    }

        Alert.alert(
      '삭제 확인',
      isBoardTarget ? '이 게시물을 삭제할까요?' : '이 댓글을 삭제할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            if (isBoardTarget) {
              deleteBoardMutation(targetId);
            } else {
              deleteReplyMutation(targetId);
            }
          },
        },
      ],
    );
  }, [deleteBoardMutation, deleteReplyMutation, postInfo.bno, postInfo.rno, postInfo.typeOfPost]);

  const handleToolPress = useCallback(
    (type: ToolType) => {
      switch (type) {
        case 'like':
          handleToggleLike();
          break;
        case 'reply':
          handleComposeReply();
          break;
        case 'linkCopy':
          handleCopyLink();
          break;
        default:
          break;
      }
    },
    [handleComposeReply, handleCopyLink, handleToggleLike],
  );

  const handleEditModal = useCallback(() => {
    console.log('edit modal opened',postInfo);
    const editType =
      postInfo.typeOfPost === 'board'
        ? 'board'
        : postInfo.typeOfPost === 'nestRe'
        ? 'nestRe'
        : 'reply';

    const imageValue =
      editType === 'board'
        ? postInfo.boardImages ?? []
        : postInfo.commentImage
        ? [postInfo.commentImage]
        : [];

    const originalData = {
      content: postInfo.contents ?? '',
      tags: postInfo.tags ?? [],
      mentions: postInfo.mentions ?? [],
      images: imageValue,
      isLikeVisible: postInfo.isLikeVisible,
      isReplyAllowed: postInfo.isReplyAllowed,
    };
    openModal('fullScreen', {
      title: '스레드 편집',
      leftActionLabel: '취소',
      renderContent: () => (
        <CreatePostReNew
          type={editType}
          bno={postInfo?.bno}
          rno={postInfo?.rno}
          parentRno={postInfo?.parentRno}
          original={originalData}
          onRequestClose={closeModal}
        />
      ),
    });


  }, [closeModal, openModal, postInfo]);

  const tools = useMemo<PostToolDescriptor[]>(() => {
    const list: PostToolDescriptor[] = [];

    if (postInfo.isLikeVisible !== false) {
      list.push({
        type: 'like',
        value: { isLike: isLiked, numberValue: likeCount },
      });
    }


      list.push({
        type: 'reply',
        value: { numberValue: commentCount },
      });
    

    list.push({
      type: 'linkCopy',
      value: { postInfo },
    });

    return list;
  }, [commentCount, isLiked, likeCount, postInfo]);

  const handleOpenOptions = useCallback(() => {
    const menuItems: Array<{
      label: string;
      iconName?: string;
      onPress: () => void;
    }> = [
      {
        label: '링크 공유',
        iconName: 'link-outline',
        onPress: handleCopyLink,
      },
    ];

    if (isPostOwner) {

      if (isBoardPost) {
        menuItems.push(
          {
            label: postInfo.isLikeVisible ? '좋아요 수 숨기기' : '좋아요 수 표시',
            iconName: postInfo.isLikeVisible ? 'eye-off-outline' : 'eye-outline',
            onPress: handleToggleLikeVisibility,
          },
          {
            label: postInfo.isReplyAllowed ? '댓글 비허용' : '댓글 허용',
            iconName: 'chatbubble-ellipses-outline',
            onPress: handleToggleComments,
          },
        );
      }

      menuItems.push({
        label: isBoardPost ? '게시물 삭제' : '댓글 삭제',
        iconName: 'trash-outline',
        onPress: handleConfirmDelete,
      });
           menuItems.push({
       label: '편집하기1',
       iconName: 'trash-outline',
       onPress: handleEditModal,
      });
    } else {
      menuItems.push({
        label: postInfo.isFollowing ? '언팔로우' : '팔로우',
        iconName: postInfo.isFollowing ? 'person-remove-outline' : 'person-add-outline',
        onPress: postInfo.isFollowing ? handleUnfollowUser : handleFollowUser,
      });
        menuItems.push({
        // label: postInfo.isBookMarked ? '게시물 삭제' : '댓글 삭제',
        label: true ? '북마크 저장' : '북마크 취소',
        iconName: 'trash-outline',
        onPress: handleConfirmDelete,
      });
    }

    openModal('menu', {
      title: '게시물 옵션',
      items: menuItems,
    });
  }, [
    handleConfirmDelete,
    handleCopyLink,
    handleFollowUser,
    handleToggleComments,
    handleToggleLikeVisibility,
    handleUnfollowUser,
    isBoardPost,
    isPostOwner,
    openModal,
    postInfo.isFollowing,
    postInfo.isLikeVisible,
    postInfo.isReplyAllowed,
    handleEditModal,
  ]);

  const handleOpenProfile = useCallback(() => {
    if (!profileUsername) {
      return;
    }

    let targetNav: any = navigation;
    while (targetNav) {
      const state = targetNav.getState ? targetNav.getState() : null;
      if (state?.routeNames?.includes?.('ProfileMenu')) {
        if (typeof targetNav.push === 'function') {
          targetNav.push('ProfileMenu', { username: profileUsername });
        } else {
          targetNav.navigate('ProfileMenu', { username: profileUsername });
        }
        return;
      }
      targetNav = targetNav.getParent ? targetNav.getParent() : null;
    }

    if (typeof navigation.push === 'function') {
      navigation.push('ProfileMenu', { username: profileUsername });
    } else {
      navigation.navigate('ProfileMenu', { username: profileUsername });
    }
  }, [navigation, profileUsername]);

  const ContentBody = (
    <View style={styles.body}>
      <View style={[styles.body, isDetailPost ? { paddingVertical: 10 } : null]}>
        {postInfo.contents ? (
          <Text style={[styles.content, { color: colors.textPrimary }]}>{postInfo.contents}</Text>
        ) : (
          <Text>없어요</Text>
        )}

        {postInfo.boardImages && postInfo.boardImages.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageScrollContent}
            style={styles.imageScroll}
          >
            {postInfo.boardImages.map((uri, index) => (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={styles.postImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : null}

        {postInfo.tags && postInfo.tags.length > 0 ? (
          <View style={styles.tagContainer}>
            {postInfo.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.card }]}>
                <Text style={[styles.tagText, { color: palette.themeColor }]}>{`${tag}`}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.toolbar}>
        {tools.map((tool) => (
          <PostTool key={tool.type} onPress={handleToolPress} typeOfTool={tool} isDark={isDark} />
        ))}
      </View>
    </View>
  );

const PostComponent = (
    <View
      style={[
        styles.headerRow,
        isDetailPost && { marginBottom: 12, alignItems: 'flex-start' },
      ]}
    >
      <ProfileContainer
        profileImg={postInfo.profilePicture}
        nickName={postInfo.nickName}
        size={40}
        isClickable
        onPress={handleOpenProfile}
      />

      <View style={styles.headerText}>
        <View style={styles.headerText__usernamefield}>
          <View style={styles.headerText__usernamefield__group}>
            <View style={styles.headerText__usernamefield__group_left}>
              <TouchableOpacity onPress={handleOpenProfile} hitSlop={8}>
                <Text style={[styles.nickname, { color: colors.textPrimary }]} numberOfLines={1}>
                  {postInfo.nickName}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]} numberOfLines={1}>
                {postInfo.regData ?? '?시간'}
              </Text>
            </View>
            <View style={styles.right}>
              <TouchableOpacity
                onPress={handleOpenOptions}
                style={styles.moreButton}
                accessibilityRole="button"
                accessibilityLabel="옵션 열기"
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
          <View>{isDetailPost ? null : ContentBody}</View>
        </View>
      </View>
    </View>
  );

  const DetailPost = (
    <View style={styles.detailBody}>
      <View style={styles.headerRow__detailPost}>
        <ProfileContainer
          profileImg={postInfo.profilePicture}
          nickName={postInfo.nickName}
          size={40}
          isClickable
          onPress={handleOpenProfile}
        />
        <View style={styles.headerText}>
          <TouchableOpacity onPress={handleOpenProfile} hitSlop={8}>
            <Text style={[styles.nickname, { color: colors.textPrimary }]} numberOfLines={1}>
              {postInfo.nickName}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]} numberOfLines={1}>
            {postInfo.regData ?? '?시간'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOpenOptions}
          style={styles.moreButton}
          accessibilityRole="button"
          accessibilityLabel="옵션 열기"
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      {ContentBody}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={onPressPost ? 0.92 : 1}
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={handlePressPost}
    >
      {isDetailPost ? DetailPost : PostComponent}
    </TouchableOpacity>
  );
};

const createStyles = (colors: ReturnType<typeof useAppTheme>['colors']) =>
  StyleSheet.create({
    card: {
      width: '100%',
      alignSelf: 'stretch',
      paddingHorizontal: 16,
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      gap: 16,
    },
    detailBody: {},
    headerRow: {
      flexDirection: 'row',
      gap: 12,
    },
    headerRow__detailPost: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerText: {
      gap: 2,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerText__usernamefield: {
      flex: 1,
    },
    headerText__usernamefield__group: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText__usernamefield__group_left: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    right: {},
    nickname: {
      fontSize: 16,
      fontWeight: '600',
    },
    timestamp: {
      marginLeft: 5,
      fontSize: 12,
      color: colors.textSecondary,
    },
    moreButton: {
      padding: 4,
    },
    body: {},
    content: {
      fontSize: 15,
    },
    imageScroll: {
      borderRadius: 16,
    },
    imageScrollContent: {
      gap: 12,
    },
    postImage: {
      width: 240,
      height: 160,
      borderRadius: 16,
      backgroundColor: colors.card,
    },
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tag: {
      marginVertical: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '600',
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  });

export default PostItem;
