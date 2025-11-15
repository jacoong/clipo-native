import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ButtonComponent from '../../components/ButtonComponent';
import { BodyText, H1 } from '../../components/Typography';
import { useAppTheme } from '../../theme/ThemeProvider';
import CustomValidateInput, { InputType } from '../../components/CustomValidateInput';
import { HomeStackParamList } from '../../navigation/types';
import { typeOfValidator } from '../../../store/validator';
import { useAuthMutations } from '../../../store/LoginLogic';

type JoinPageProps = NativeStackScreenProps<HomeStackParamList, 'Join'>;

const JoinPage: React.FC<JoinPageProps> = ({ navigation }) => {
  const { colors, palette } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [emailValidation, setEmailValidation] = useState<typeOfValidator>({
    touched: false,
    error: false,
    message: '',
  });
  const [passwordValidation, setPasswordValidation] = useState<typeOfValidator>({
    touched: false,
    error: false,
    message: '',
  });
  const [passwordConfirmValidation, setPasswordConfirmValidation] =
    useState<typeOfValidator>({
      touched: false,
      error: false,
      message: '',
    });
  const { sendLoginLogic } = useAuthMutations();
  const handleValidation = useCallback(
    (type: InputType, result: typeOfValidator, value: string) => {
      switch (type) {
        case 'email':
          setEmailValidation(result);
          setEmail(value);
          break;
        case 'password':
          setPasswordValidation(result);
          setPassword(value);
          break;
        case 'confirmPassword':
          setPasswordConfirmValidation(result);
          setPasswordConfirm(value);
          break;
        default:
          break;
      }
    },
    [],
  );

  const sendJoinLogicHandler = async () => {
    Keyboard.dismiss();
    try {
      await sendLoginLogic('join', { email, password });
      navigation.navigate('SmsRequest', { email });
    } catch (err) {
        const message =
        err?.response?.data?.message ??
        err?.message ??
        '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
        console.log('ee')
        Alert.alert(
        '회원가입 실패',                // Title
        message, // Message
        );
      }
  };
  

  const isDisabled = !(
    emailValidation.touched &&
    !emailValidation.error &&
    passwordValidation.touched &&
    !passwordValidation.error &&
    passwordConfirmValidation.touched &&
    !passwordConfirmValidation.error
  );

  return (
    <View
      style={[styles.safeArea,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
        }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 24 })}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <H1 style={styles.title}>회원가입</H1>
            <BodyText style={styles.subtitle}>아래의 빈칸을 채워주세요</BodyText>

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

              <CustomValidateInput
                inputType="confirmPassword"
                value={passwordConfirm}
                compareValue={password}
                onChangeValue={setPasswordConfirm}
                sendValidateValue={handleValidation}
              />
            </View>

            <ButtonComponent
              label="Create Account"
              variant="primary"
              disabled={isDisabled}
              onPress={sendJoinLogicHandler}
              style={styles.submitButton}
            />
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
  submitButton: {
    marginTop: 8,
  },
});

export default JoinPage;
