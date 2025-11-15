import React, { useMemo } from 'react';
import { Button, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ButtonComponent from '../../components/ButtonComponent';
import { BodyText } from '../../components/Typography';
import { COLOR } from '../../theme/colors';
import { useAppTheme } from '../../theme/ThemeProvider';
import SocialLogin from '../../components/LoginScreenComponents/SocialLogin';
import { HomeStackParamList } from '../../navigation/types';

type MainProps = NativeStackScreenProps<HomeStackParamList, 'Main'>;

const Main: React.FC<any> = ({ navigation }) => {
  const { colors, palette, mode } = useAppTheme();
  const insets = useSafeAreaInsets();

  const { width,height } = Dimensions.get('window');
 
  const guestGradient = useMemo<[string, string, string]>(
    () =>
      mode === 'dark'
        ? ['#0f0c29', '#302b63', '#24243e']
        : [palette.themeColor, '#9966CC', '#15B8A6'],
    [mode, palette.themeColor],
  );

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.content}>
   
        
        <View style={[styles.titleWrapper, { paddingHorizontal: height * 0.03, paddingVertical: height * 0.08 }]}>
          <Text style={[styles.title,{color:colors.textPrimary}]}>공동체를 구성하고 일상을 공유하세요.</Text>
        </View>


        <View style={styles.loginWrapper}>
            <ButtonComponent
            label="로그인하기"
            variant="primary"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton} 
            />

            <LinearGradient
            colors={guestGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
            >
            <ButtonComponent
                label="게스트(Neo)로 로그인"
                variant="ghost"
                style={styles.gradientInner}
                textStyle={{ color: COLOR.customRealWhite }}
            />
            </LinearGradient>

            <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <BodyText style={{ color: colors.textSecondary }}>또는</BodyText>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.socialRow}>
            <SocialLogin onPress={(provider) => console.log('social login', provider)} />
            </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'stretch',
    gap: 24,
  },
imageWrapper:{
    justifyContent:'center',
    alignItems:'center'
},

  titleWrapper: {
    paddingHorizontal: 54,
    paddingVertical: 54,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
  },
  loginWrapper: {
    paddingBottom: 30,
  },
  loginButton: {
    marginTop: 16,
  },
  gradientButton: {
    marginTop: 16,
    borderRadius:999,
  },
  gradientInner: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  dividerRow: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialRow: {
    paddingVertical: 24,
  },
});

export default Main;
