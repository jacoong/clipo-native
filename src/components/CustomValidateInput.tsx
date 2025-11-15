import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppTheme } from '../theme/ThemeProvider';
import {
  birthdayValidator,
  confirmPasswordValidator,
  descriptionValidator,
  emailValidator,
  encodedCheckCodeValidator,
  locationValidator,
  newPasswordValidator,
  passwordValidator,
  typeOfValidator,
  userNameValidator,
} from '../../store/validator';

export type InputType =
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'newPassword'
  | 'username'
  | 'encodedCheckCode'
  | 'smsCode'
  | 'emailCode'
  | 'description'
  | 'location'
  | 'birthday';

interface CustomValidateInputProps {
  inputType: InputType;
  value: string;
  sendValidateValue: (type: InputType, result: typeOfValidator, value: string) => void;
  onChangeValue: (value: string) => void;
  compareValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

const DEFAULT_VALIDATOR_STATE: typeOfValidator = {
  touched: false,
  error: false,
  message: '',
};

const CustomValidateInput: React.FC<CustomValidateInputProps> = ({
  inputType,
  value,
  sendValidateValue,
  onChangeValue,
  compareValue = '',
  placeholder,
  autoFocus,
}) => {
  const { colors, fonts, palette } = useAppTheme();
  const [validation, setValidation] = useState<typeOfValidator>(DEFAULT_VALIDATOR_STATE);

  const runValidation = useCallback(
    async (text: string) => {
      let result: typeOfValidator = DEFAULT_VALIDATOR_STATE;

      switch (inputType) {
        case 'email':
          result = await emailValidator(text);
          break;
        case 'password':
          result = passwordValidator(text);
          break;
        case 'confirmPassword':
          result = confirmPasswordValidator(compareValue ?? '', text);
          break;
        case 'newPassword':
          result = newPasswordValidator(text, compareValue ?? '');
          break;
        case 'username':
          result = await userNameValidator(text);
          break;
        case 'encodedCheckCode':
        case 'smsCode':
        case 'emailCode':
          result = encodedCheckCodeValidator(text);
          break;
        case 'description':
          result = descriptionValidator(text);
          break;
        case 'location':
          result = locationValidator(text);
          break;
        case 'birthday':
          result = birthdayValidator(text);
          break;
        default:
          result = {
            touched: text.length > 0,
            error: false,
            message: '',
          };
      }

      setValidation(result);
      sendValidateValue(inputType, result, text);
    },
    [compareValue, inputType, sendValidateValue],
  );

  const handleChangeText = (text: string) => {
    onChangeValue(text);
    runValidation(text);
  };

  useEffect(() => {
    if (validation.touched) {
      runValidation(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareValue, inputType]);

  const secureTextEntry =
    inputType === 'password' ||
    inputType === 'confirmPassword' ||
    inputType === 'newPassword';

  const keyboardType =
    inputType === 'email'
      ? 'email-address'
      : inputType === 'smsCode' ||
        inputType === 'encodedCheckCode' ||
        inputType === 'emailCode'
      ? Platform.OS === 'android'
        ? 'numeric'
        : 'number-pad'
      : 'default';
  const isMultiline = inputType === 'description';

  const borderColor = validation.touched
    ? validation.error
      ? palette.customRed
      : palette.customGreen
    : colors.border;

  const resolvedPlaceholder =
    placeholder ??
    {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      newPassword: 'New password',
      username: 'Username',
      encodedCheckCode: 'Verification code',
      smsCode: 'SMS code',
      emailCode: 'Email code',
      description: 'Description',
      location: 'Location',
      birthday: 'Birthday',
    }[inputType];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor,
          },
        ]}
      >
        <TextInput
          textContentType="none"  // ✅ iOS 자동 제안 비활성화
          autoComplete="off"      // ✅ Android 자동완성 차단
          value={value}
          onChangeText={handleChangeText}
          placeholder={resolvedPlaceholder}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: fonts.regular,
            },
            isMultiline && styles.multiline,
          ]}
          autoCapitalize={
            inputType === 'email' ||
            inputType === 'smsCode' ||
            inputType === 'encodedCheckCode' ||
            inputType === 'emailCode'
              ? 'none'
              : 'sentences'
          }
          autoCorrect={false}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={isMultiline}
          numberOfLines={isMultiline ? 3 : 1}
          autoFocus={autoFocus}
        />
      </View>
      {validation.touched && validation.error && (
        <Text style={[styles.helperText, { color: palette.customRed }]}>
          {validation.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: Platform.select({ ios: 15, android: 10 }),
  },
  input: {
    fontSize: 16,
  },
  multiline: {
    height: 96,
    textAlignVertical: 'top',
  },
  helperText: {
    marginTop: 4,
    fontSize: 13,
  },
});

export default CustomValidateInput;
