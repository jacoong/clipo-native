import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Main: undefined;
  Login: undefined;
  ForgetPassword:undefined;
  SetNewPassword: { oldPassword?: string } | undefined;
  EmailAuthentication: undefined;
  SocialLogin: undefined;
  Join: undefined;
  SmsRequest: { email?: string } | undefined;
  SmsAuthentication: { email?: string; phone: string };
};

export type ValidateStackParamList = {
  SmsRequest: { email?: string } | undefined;
  SmsAuthentication: { email?: string; phone: string };
};

export type HomeDrawerParamList = {
  RecommandPost: undefined;
  FollowingPost: undefined;
  LikedPost: undefined;
};

export type HomeMenuStackParamList = {
  HomeDrawer: NavigatorScreenParams<HomeDrawerParamList>;
  DetailPost: { username: string; bno: string };
  DetailPostComment: { username: string; bno: string; rno: string };
  DetailPostNested: {
    username: string;
    bno: string;
    rno: string;
    nestRe: string;
  };
  NaviDetailPost: { bno: string };
  NaviDetailPostComment: { bno: string; rno: string };
  ProfileMenu: { username: string };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResultPage: { typeOfFilter: 'Account' | 'Hashtag'; value: string };
  TagsPost: { tagValue: string; value?: string; typeOfFilter?: 'PostWithTags' };
  ProfileMenu: { username: string };
};

export type ProfileStackParamList = {
  ProfileMain: { username?: string };
};

export type ActivityStackParamList = {
  ActivityMain: undefined;
  ProfileMenu: { username: string };
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeMenuStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  ActivityTab: NavigatorScreenParams<ActivityStackParamList>;
  ProfileTab: { username?: string };
};

export type MainStackParamList = {
  UserNameRequired:undefined;
  CheckedAuthenticatedPage:undefined;
  Tabs: NavigatorScreenParams<MainTabParamList>;
  ProfileMenu: { username: string };
  DetailPost: { username: string; bno: string };
  DetailPostComment: { username: string; bno: string; rno: string };
  DetailPostNested: {
    username: string;
    bno: string;
    rno: string;
    nestRe: string;
  };
  NaviDetailPost: { bno: string };
  NaviDetailPostComment: { bno: string; rno: string };
};

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  SocialLoginProcess: { typeOfPlatform: string };
  Validate: NavigatorScreenParams<ValidateStackParamList>;
  Username: undefined;
  Main: NavigatorScreenParams<MainStackParamList>;
  UpdatePassword: undefined;
  Confirm: undefined;
  NotFound: undefined;
};
