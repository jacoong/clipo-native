import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ButtonComponent from '../../components/ButtonComponent';
import CustomValidateInput, { InputType } from '../../components/CustomValidateInput';
import { BodyText, H1 } from '../../components/Typography';
import { useAppTheme } from '../../theme/ThemeProvider';
import { HomeStackParamList } from '../../navigation/types';
import { typeOfValidator } from '../../../store/validator';
import { useAuthMutations } from '../../../store/LoginLogic';
import { CommonActions } from '@react-navigation/native';
type SmsAuthenticationProps = NativeStackScreenProps<HomeStackParamList, 'SmsAuthentication'>;

const INITIAL_VALIDATION: typeOfValidator = {
  touched: false,
  error: false,
  message: '',
};

const SmsAuthentication: React.FC<SmsAuthenticationProps> = ({ navigation, route }) => {
  const { colors, palette } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { sendLoginLogic } = useAuthMutations();

  const { email, phone } = route.params ?? {};

  const [code, setCode] = useState('');
  const [codeValidation, setCodeValidation] = useState<typeOfValidator>(INITIAL_VALIDATION);
  const [pending, setPending] = useState(false);

  const handleValidation = useCallback((_: InputType, result: typeOfValidator, value: string) => {
    setCodeValidation(result);
    setCode(value);
  }, []);

  const submitHandler = useCallback(async () => {
    Keyboard.dismiss();

    if (!codeValidation.touched || codeValidation.error || !code) {
      setCodeValidation(prev =>
        prev.touched
          ? prev
          : { touched: true, error: true, message: '인증번호를 입력하세요.' },
      );
      return;
    }

    try {
      setPending(true);
      await sendLoginLogic('smsVerification', {
        validateSMSCode: code,
        email: email ?? '',
        phone,
      });

      const resetAction = CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              index: 0,
              routes: [
                {
                  name: 'Tabs',
                  state: {
                    index: 0,
                    routes: [
                      {
                        name: 'HomeTab',
                        state: {
                          index: 0,
                          routes: [
                            {
                              name: 'HomeDrawer',
                              state: {
                                index: 0,
                                routes: [{ name: 'RecommandPost' }],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      });

      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
        rootNavigation.dispatch(resetAction);
      } else {
        navigation.dispatch(resetAction);
      }
    } catch (err) {
      console.error('SMS 인증 실패:', err);
    } finally {
      setPending(false);
    }
  }, [code, codeValidation.error, codeValidation.touched, email, navigation, phone, sendLoginLogic]);

  const isDisabled = pending || codeValidation.error || !codeValidation.touched || !code;

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
            <H1 style={styles.title}>인증번호 입력</H1>
            <BodyText style={styles.subtitle}>
              {(email ?? '계정') + '으로 전송된 인증번호를 입력하세요.'}
            </BodyText>
            {phone ? (
              <BodyText style={styles.helper}>수신 번호: {phone}</BodyText>
            ) : null}

            <View style={styles.form}>
              <CustomValidateInput
                inputType="smsCode"
                value={code}
                onChangeValue={setCode}
                sendValidateValue={handleValidation}
                placeholder="인증번호 4자리"
                autoFocus
              />
            </View>

            <ButtonComponent
              label="인증하기"
              variant="primary"
              disabled={isDisabled}
              loading={pending}
              onPress={submitHandler}
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
    paddingVertical: 12,
    gap: 24,
    flex: 1,
  },
  title: {
    marginTop: 30,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  form: {
    gap: 12,
    alignItems:'center',
  },
  phoneContainer: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  phoneTextContainer: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  phoneInputText: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  helper:{
    textAlign:'center'
  }
});


export default SmsAuthentication;
