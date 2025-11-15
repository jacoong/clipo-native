import React from 'react';
import { StyleSheet, View } from 'react-native';

import ButtonComponent from '../ButtonComponent';
import { useAppTheme } from '../../theme/ThemeProvider';

const SOCIAL_BUTTONS = [
  { key: 'google', label: 'G', backgroundColor: '#FFFFFF', textColor: '#EA4335' },
  { key: 'kakao', label: 'K', backgroundColor: '#FEE500', textColor: '#3C1E1E' },
  { key: 'naver', label: 'N', backgroundColor: '#03C75A', textColor: '#FFFFFF' },
];

type SocialLoginProps = {
  onPress?: (provider: string) => void;
};

const SocialLogin: React.FC<SocialLoginProps> = ({ onPress }) => {
  const { fonts } = useAppTheme();

  return (
    <View style={styles.buttonContainer}>
      {SOCIAL_BUTTONS.map((button) => (
        <View key={button.key} style={styles.buttonWrap}>
          <ButtonComponent
            label={button.label}
            variant="ghost"
            pill
            fullWidth
            onPress={() => onPress?.(button.key)}
            style={({ pressed }) => [
              { backgroundColor: button.backgroundColor },
              pressed ? styles.buttonPressed : null,
            ]}
            textStyle={{
              color: button.textColor,
              fontFamily: fonts.bold,
              fontSize: 18,
            }}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  buttonWrap: {
    flex: 1,
  },
  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },
});

export default SocialLogin;
