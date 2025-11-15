import React, { useCallback, useRef, useState } from 'react';
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
import PhoneInput, { PhoneInputRefType } from '@linhnguyen96114/react-native-phone-input';
import { Ionicons } from '@expo/vector-icons';

import ButtonComponent from '../../components/ButtonComponent';
import { BodyText, H1 } from '../../components/Typography';
import { useAppTheme } from '../../theme/ThemeProvider';
import { HomeStackParamList, ValidateStackParamList } from '../../navigation/types';
import { typeOfValidator } from '../../../store/validator';
import { useAuthMutations } from '../../../store/LoginLogic';

const INITIAL_VALIDATION: typeOfValidator = {
  touched: false,
  error: false,
  message: '',
};

type CombinedStackParamList = HomeStackParamList & ValidateStackParamList;
type SmsRequestPageProps = NativeStackScreenProps<CombinedStackParamList, 'SmsRequest'>;

const SmsRequest: React.FC<SmsRequestPageProps> = ({ navigation, route }) => {
  const { colors, palette, fonts, mode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { sendLoginLogic } = useAuthMutations();
  const phoneInputRef = useRef<PhoneInputRefType>(null);

  const email = route.params?.email ?? '';

  const [rawPhone, setRawPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [phoneValidation, setPhoneValidation] = useState<typeOfValidator>(INITIAL_VALIDATION);
  const [callingCodeDisplay, setCallingCodeDisplay] = useState('+82');
  const [selectedCountryCode, setSelectedCountryCode] = useState('KR');
  const [pending, setPending] = useState(false);

  const updateValidation = useCallback((isValid: boolean) => {
    setPhoneValidation({
      touched: true,
      error: !isValid,
      message: isValid ? '' : '올바른 휴대폰 번호를 입력하세요.',
    });
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setRawPhone(value);
    if (!value) {
      setFormattedPhone('');
      setPhoneValidation(INITIAL_VALIDATION);
    }
  }, []);

  const handleFormattedChange = useCallback(
    (value: string) => {
      setFormattedPhone(value);
      if (!value) {
        setPhoneValidation(INITIAL_VALIDATION);
        return;
      }

      const ref = phoneInputRef.current;
      const isValid = ref?.isValidNumber(value) ?? false;
      updateValidation(isValid);
    },
    [updateValidation],
  );

  const handleCountryChange = useCallback(
    (country: { callingCode?: string[]; cca2?: string }) => {
      const nextCallingCode = country?.callingCode?.[0];
      if (nextCallingCode) {
        setCallingCodeDisplay(`+${nextCallingCode}`);
      }
      if (country?.cca2) {
        setSelectedCountryCode(country.cca2);
      }

      const ref = phoneInputRef.current;
      const isValid = ref?.isValidNumber(formattedPhone || rawPhone) ?? false;
      if (formattedPhone || rawPhone) {
        updateValidation(isValid);
      } else {
        setPhoneValidation(INITIAL_VALIDATION);
      }
    },
    [formattedPhone, rawPhone, updateValidation],
  );

  const requestSmsHandler = useCallback(async () => {
    Keyboard.dismiss();

    const ref = phoneInputRef.current;
    const hasRawPhone = rawPhone.trim().length > 0 || formattedPhone.trim().length > 0;

    if (!hasRawPhone) {
      setPhoneValidation({ touched: true, error: true, message: '휴대폰 번호를 입력하세요.' });
      return;
    }

    const isValid = ref?.isValidNumber(formattedPhone || rawPhone) ?? false;
    if (!isValid) {
      updateValidation(false);
      return;
    }

    let payloadPhone = formattedPhone || rawPhone;
    if (ref) {
      const { formattedNumber, number } = ref.getNumberAfterPossiblyEliminatingZero();
      const callingCode = ref.getCallingCode();
      const digits = (formattedNumber ?? number ?? '').replace(/\s/g, '');
      if (digits) {
        payloadPhone = digits.startsWith('+')
          ? digits
          : callingCode
          ? `+${callingCode}${digits}`
          : digits;
      }
    } else if (callingCodeDisplay && !payloadPhone.startsWith('+')) {
      payloadPhone = `${callingCodeDisplay}${payloadPhone}`;
    }

    try {
      setPending(true);
      await sendLoginLogic('smsRequest', { phone: payloadPhone });
      navigation.navigate('SmsAuthentication', { email, phone: payloadPhone });
    } catch (err) {
      console.error('SMS 요청 실패:', err);
    } finally {
      setPending(false);
    }
  }, [email, formattedPhone, navigation, rawPhone, sendLoginLogic, updateValidation]);

  const isDisabled = pending || phoneValidation.error || !phoneValidation.touched;

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
            <H1 style={styles.title}>전화번호 인증</H1>
            <BodyText style={styles.subtitle}>
              {email
                ? `${email} 계정으로 인증번호를 받기 위해 휴대폰 번호를 입력하세요.`
                : '휴대폰 번호를 입력한 뒤 인증번호를 받아주세요.'}
            </BodyText>

            <View style={styles.form}>
              <PhoneInput
                ref={phoneInputRef}
                defaultCode={selectedCountryCode as any}
                layout="second"
                value={rawPhone}
                autoFocus
                withShadow
                withDarkTheme={mode === 'dark'}
                onChangeText={handlePhoneChange}
                onChangeFormattedText={handleFormattedChange}
                onChangeCountry={handleCountryChange}
                textInputStyle={[
                  styles.phoneInputText,
                  { color: colors.textPrimary, fontFamily: fonts.regular },
                ]}
                codeTextStyle={{ color: colors.textPrimary, fontFamily: fonts.regular }}
                textContainerStyle={[
                  styles.phoneTextContainer,
                  { backgroundColor: colors.surface },
                ]}
                containerStyle={[
                  styles.phoneContainer,
                  {
                    backgroundColor: colors.surface,
                    borderColor: phoneValidation.touched
                      ? phoneValidation.error
                        ? palette.customRed
                        : palette.customGreen
                      : colors.border,
                  },
                ]}
                renderDropdownImage={
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={colors.textPrimary}
                    style={{ marginLeft: 4 }}
                  />
                }
              />
            <BodyText
              style={{
                color: palette.customRed,
                minHeight: 20, // 항상 높이 유지

                opacity: phoneValidation.touched && phoneValidation.error ? 1 : 0,
              }}
            >
              {phoneValidation.message || '올바른 휴대폰 번호를 입력하세요.'}
            </BodyText>
            </View>

            <ButtonComponent
              label="인증번호 받기"
              variant="primary"
              disabled={isDisabled}
              loading={pending}
              onPress={requestSmsHandler}
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
});

export default SmsRequest;
