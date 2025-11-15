import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Services from '../../store/ApiService';

type TypeOfFilter =
  | 'Saved'
  | 'BiPagenation'
  | 'Activity'
  | 'NestRe'
  | 'MainRandom'
  | 'Post'
  | 'Replies'
  | 'Likes'
  | 'Reply'
  | 'Following'
  | 'Follower'
  | 'LikedUser'
  | 'Account'
  | 'Hashtag'
  | 'PostWithTags'
  | 'FollowingPost';

interface UsePostsPaginationProps {
  typeOfFilter: TypeOfFilter;
  username?: string;
  bno?: number;
  rno?: number;
  value?: string | null;
  initialPage?: number;
  enabled?: boolean;
}

interface PostResponseBodyType<T = any> {
  data: T[];
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PostsResponse<T = any> {
  body: PostResponseBodyType<T>;
}

const resolveQueryKey = ({
  typeOfFilter,
  username,
  bno,
  rno,
  value,
}: UsePostsPaginationProps) => {
  switch (typeOfFilter) {
    case 'Reply':
      return ['fetchPosts', 'Reply', bno];
    case 'NestRe':
      return ['fetchPosts', 'NestRe', rno];
    case 'Post':
    case 'Replies':
    case 'Likes':
      return ['fetchPosts', typeOfFilter, username];
    case 'LikedUser':
      return ['fetchPosts', typeOfFilter, bno];
    case 'Account':
    case 'Hashtag':
      return ['fetchPosts', typeOfFilter, `filterValue:${value}`];
    case 'PostWithTags':
      return ['fetchPosts', typeOfFilter, `filterValue:${value}`];
    default:
      return ['fetchPosts', typeOfFilter];
  }
};

const fetchPageByFilter = async ({
  typeOfFilter,
  username,
  bno,
  rno,
  value,
  page,
}: UsePostsPaginationProps & { page: number }) => {
  const { SocialService: service } = Services;

  switch (typeOfFilter) {
    case 'MainRandom':
      return (await service.fetchPosts(page)).data;
    case 'Post':
    case 'Replies':
    case 'Likes':
      return (await service.fetchUserPosts({ username, typeOfFilter, pages: page })).data;
    case 'BiPagenation':
    case 'Reply':
      return (await service.fetchedReply(bno!, page)).data;
    case 'NestRe':
      return (await service.fetchedNestRe(rno!, page)).data;
    case 'Following':
    case 'Follower':
      return (await service.fetchedFollowingFollower({ username, typeOfFilter }, page)).data;
    case 'LikedUser':
      return (await service.likedUserFetch({ bno, username }, page)).data;
    case 'Account':
      return (await service.searchUserAccount(value!, page)).data;
    case 'Hashtag':
      return (await service.searchHashTag(value!, page)).data;
    case 'PostWithTags':
      return (await service.fetchPostWithTags(value!, page)).data;
    case 'Activity':
      return (await service.fetchActivity(page)).data;
    case 'FollowingPost':
      return (await service.fetchFollowPost(page)).data;
    case 'Saved':
      return (await service.bookmarkUserFetch(page)).data;
    default:
      throw new Error(`Unknown filter: ${typeOfFilter}`);
  }
};

export function usePostsPagination<T = any>(
  props: UsePostsPaginationProps,
): UseInfiniteQueryResult<InfiniteData<PostsResponse<T>>, AxiosError> {
  const { enabled = true, initialPage = 0 } = props;

  return useInfiniteQuery<PostsResponse<T>, AxiosError>({
    queryKey: resolveQueryKey(props),
    enabled,
    initialPageParam: initialPage,
    queryFn: ({ pageParam }) => {
      const page = typeof pageParam === 'number' ? pageParam : initialPage;
      return fetchPageByFilter({ ...props, page });
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: props.typeOfFilter === 'LikedUser' ? 'always' : false,
    getNextPageParam: (lastPage) =>
      lastPage.body.hasNext ? lastPage.body.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.body.hasPrev ? firstPage.body.page - 1 : undefined,
  });
}
