import React, { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { ActivityIndicator, ColorSchemeName, useColorScheme, View } from 'react-native';
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';

import {
  AppThemeMode,
  COLOR,
  Palette,
  darkThemeColors,
  lightThemeColors,
  ThemedColor,
} from './colors';

type FontFamily = {
  regular: string;
  medium: string;
  bold: string;
};

type ThemeValue = {
  mode: AppThemeMode;
  palette: Palette;
  colors: ThemedColor;
  fonts: FontFamily;
};

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

const getMode = (scheme: ColorSchemeName): AppThemeMode =>
  scheme === 'dark' ? 'dark' : 'light';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme();
  const mode = getMode(colorScheme);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  const value = useMemo<ThemeValue>(
    () => ({
      mode,
      palette: COLOR,
      colors: mode === 'dark' ? darkThemeColors : lightThemeColors,
      fonts: {
        regular: 'Urbanist_400Regular',
        medium: 'Urbanist_600SemiBold',
        bold: 'Urbanist_700Bold',
      },
    }),
    [mode],
  );

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            mode === 'dark'
              ? darkThemeColors.background
              : lightThemeColors.background,
        }}
      >
        <ActivityIndicator size="small" color={COLOR.themeColor} />
      </View>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
};
 