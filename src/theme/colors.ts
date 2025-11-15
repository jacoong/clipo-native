export const COLOR = {
  themeColor: '#A435F0',
  hovercustomBlack: '#212121',
  hoverLightGray: '#F1F1F1',
  customLightBlack: '#181818',
  customBlack: '#0A0A0A',
  customGray: 'rgb(153, 153, 153)',
  customborderLightGray: '#D9D9D9',
  customborderDarkGray: '#2D2D2D',
  customRealWhite: '#FFFFFF',
  customWhite: '#FAFAFA',
  customGreen: '#15B8A6',
  customRed: '#EF4243',
  customBlue: '#9966CC',
  customWhiteSkeletonBaseColor: '#ebebeb',
  customWhiteSkeletonHighlightColor: '#f5f5f5',
  customBlackSkeletonBaseColor: '#2D2D2D',
  customBlackSkeletonHighlightColor: '#999999',
} as const;

export type Palette = typeof COLOR;

export type AppThemeMode = 'light' | 'dark';

export type ThemedColor = {
  background: string;
  surface: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  placeholder: string;
  skeletonBase: string;
  skeletonHighlight: string;
};

export const lightThemeColors: ThemedColor = {
  background: COLOR.customWhite,
  surface: COLOR.customRealWhite,
  card: COLOR.hoverLightGray,
  textPrimary: COLOR.customBlack,
  textSecondary: COLOR.customGray,
  border: COLOR.customborderLightGray,
  placeholder: COLOR.customGray,
  skeletonBase: COLOR.customWhiteSkeletonBaseColor,
  skeletonHighlight: COLOR.customWhiteSkeletonHighlightColor,
};

export const darkThemeColors: ThemedColor = {
  background: COLOR.customBlack,
  surface: COLOR.customLightBlack,
  card: COLOR.hovercustomBlack,
  textPrimary: COLOR.customRealWhite,
  textSecondary: COLOR.customGray,
  border: COLOR.customborderDarkGray,
  placeholder: COLOR.customGray,
  skeletonBase: COLOR.customBlackSkeletonBaseColor,
  skeletonHighlight: COLOR.customBlackSkeletonHighlightColor,
};
