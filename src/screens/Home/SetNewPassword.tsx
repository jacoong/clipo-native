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

type SetNewPasswordProps = NativeStackScreenProps<HomeStackParamList, 'SetNewPassword'>;

const SetNewPassword: React.FC<SetNewPasswordProps> = ({ navigation,route }) => {
  const { colors, palette } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { oldPassword } = route.params;
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');


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
      await sendLoginLogic('updatePassword', { oldPassword:oldPassword,newPassword:password });
         Alert.alert(
          '성공',                // Title
          '비밀번호 재생성에 성공하였습니다. 확인버튼을 누르면 로그인 페이지로 이동합니다.', // Message
            [
         {
      text: '확인',
      onPress: () => {
        navigation.navigate('Login');
      },
    },
  ]
          );
      navigation.navigate('Login');
    } catch (err) {
        const message =
        err?.response?.data?.message ??
        err?.message ??
        '비밀번호 재생성 중 오류가 발생했습니다. 다시 시도해주세요.';
        console.log('ee')
        Alert.alert(
        '비밀번호 재생성 실패',                // Title
        message, // Message
        );
      }
  };
  

  const isDisabled = !(
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
            <H1 style={styles.title}>비밀번호 재생성</H1>
            <BodyText style={styles.subtitle}>새로운 비밀번호를 입력해주세요</BodyText>

            <View style={styles.form}>

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

export default SetNewPassword;
