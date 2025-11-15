import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ButtonComponent from '../../components/ButtonComponent';
import { BodyText, H1 } from '../../components/Typography';
import { useAppTheme } from '../../theme/ThemeProvider';
import { HomeStackParamList } from '../../navigation/types';
import CustomValidateInput, { InputType } from '../../components/CustomValidateInput';
import { typeOfValidator } from '../../../store/validator';
import { useAuthMutations } from '../../../store/LoginLogic';
import { CommonActions } from '@react-navigation/native';
type LoginProps = NativeStackScreenProps<HomeStackParamList, 'Login'>;


const Login: React.FC<LoginProps> = ({ navigation }) => {
  const { colors, palette } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { sendLoginLogic } = useAuthMutations();


  const [emailValidator, setEmailValidator] = useState<typeOfValidator>({
    touched: false,
    error: false,
    message: '',
  });
  const [passwordValidator, setPasswordValidator] = useState<typeOfValidator>({
    touched: false,
    error: false,
    message: '',
  });

  const handleValidation = useCallback((type: InputType, result: typeOfValidator, value: string) => {
    if (type === 'email') {
      setEmailValidator(result);
      setEmail(value);
    } else if (type === 'password') {
      setPasswordValidator(result);
      setPassword(value);
    }
  }, []);

  const isLoginDisabled = !(
    emailValidator.touched &&
    !emailValidator.error &&
    passwordValidator.touched &&
    !passwordValidator.error
  );

  const sendLoginLogicHandler = async() => {
    Keyboard.dismiss();

    try {
      await sendLoginLogic('login', { email, password });

      const rootNavigation = navigation.getParent();
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              index: 0,
              routes: [
                {
                  name: 'CheckedAuthenticatedPage'
                },
              ],
            },
          },
        ],
      });

      if (rootNavigation) {
        rootNavigation.dispatch(resetAction);
      } else {
        navigation.dispatch(resetAction);
      }
    // 예: 내비게이션 이동, 토스트, 상태 변경 등
    // navigation.navigate('Welcome');
  } catch (err) {
    const message =
    err?.response?.data?.message ??
    err?.message ??
    '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';

    const code = err?.response?.data.code; // name error 
    const status = err?.response?.data.status; // status code
    if(code === 'NOT_VALIDATE_USER' && status === 401){
      navigation.navigate("SmsAuthentication");
      return
    }
    console.log(err,code,status)
    Alert.alert(
    '로그인 실패',                // Title
    message, // Message
    );
  }
  };



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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 24 })}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
         
              <H1 style={styles.title}>로그인</H1>
              <BodyText style={styles.subtitle}>돌아오신걸 환영합니다</BodyText>
        
            <View style={styles.form}>
              <CustomValidateInput
                inputType="email"
                value={email}
                onChangeValue={setEmail}
                sendValidateValue={handleValidation}
              />
              <CustomValidateInput
                inputType="password"
                value={password}
                onChangeValue={setPassword}
                sendValidateValue={handleValidation}
              />

              <Pressable onPress={() => navigation.navigate('ForgetPassword')}>
                <BodyText style={{ color: palette.themeColor, alignSelf: 'flex-end' }}>
                  비밀번호를 잊으셨나요?
                </BodyText>
              </Pressable>

              <ButtonComponent
                variant="primary"
                label="Login"
                disabled={isLoginDisabled}
                onPress={sendLoginLogicHandler}
                style={styles.buttonSpacing}
              />
            </View>
            <View style={styles.dividerBlock}>       
              <BodyText>계정이 없나요?</BodyText>
              <ButtonComponent
                label="회원가입하기"
                variant="default"
                onPress={() => navigation.navigate('Join')}
                style={styles.buttonSpacing}
                textStyle={{ color: palette.themeColor }}
              />
            </View>
    
   
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
   paddingHorizontal: 24,
    // paddingVertical: 12,
    gap: 24,
    flex: 1,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  dividerBlock: {
    marginTop: 12,
    alignItems: 'center',
    gap: 12,
  },
  buttonSpacing: {
    marginTop: 4,
  },
});

export default Login;
