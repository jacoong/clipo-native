import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

import { useAppTheme } from '../theme/ThemeProvider';

type LoadingIndicatorProps = {
  size?: 'small' | 'large';
  style?: ViewStyle;
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'large', style }) => {
  const { palette } = useAppTheme();
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={palette.themeColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingIndicator;
