import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ButtonComponent from '../../components/ButtonComponent';
import { BodyText, H1 } from '../../components/Typography';
import CustomValidateInput, { InputType } from '../../components/CustomValidateInput';
import { useAppTheme } from '../../theme/ThemeProvider';
import { RootStackParamList } from '../../navigation/types';
import { UserService } from '../../../store/ApiService';
import { typeOfValidator } from '../../../store/validator';
import { useAppDispatch } from '../../../store/redux/hooks';
import { setUserInfo } from '../../../store/redux/loginUserInfoSlice';
import { UserInfo } from '@clipo/core';
type Props = NativeStackScreenProps<RootStackParamList, 'Username'>;

const VALIDATION_DEFAULT: typeOfValidator = {
  touched: false,
  error: false,
  message: '',
};

const inferMimeType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
};

const UserNameRequired: React.FC<Props> = ({ navigation }) => {
  const { colors, palette } = useAppTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [usernameValidation, setUsernameValidation] =
    useState<typeOfValidator>(VALIDATION_DEFAULT);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(
    null,
  );

  const handleValidation = useCallback(
    (type: InputType, result: typeOfValidator) => {
      if (type === 'username') {
        setUsernameValidation(result);
      }
    },
    [],
  );


  const ensurePermission = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert(
        '권한 필요',
        '사진을 선택하려면 갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
      );
      return false;
    }
    return true;
  }, []);

  const handlePickImage = useCallback(async () => {
    const hasPermission = await ensurePermission();
    if (!hasPermission) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  }, [ensurePermission]);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const buildFormData = useCallback(() => {
    const trimmedName = username.trim();
    const formData = new FormData();

    formData.append('nickName', trimmedName);

    if (selectedImage) {
      const fileName =
        selectedImage.fileName ??
        selectedImage.uri.split('/').pop() ??
        'profile-image.jpg';

      formData.append('profileImage', {
        uri: selectedImage.uri,
        name: fileName,
        type: inferMimeType(fileName),
      } as any);
    }

    return formData;
  }, [selectedImage, username]);

  const {
    mutateAsync: submitProfile,
    isPending,
  } = useMutation({
    mutationKey: ['createNicknameProfileImg'],
    mutationFn: (payload: FormData) => UserService.createNicknameProfileImg(payload),
    onSuccess: async () => {
 await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  
      try {
        const latest = await queryClient.fetchQuery({
          queryKey: ['userProfile'],
          queryFn: async () => {
            const response = await UserService.getUserProfile();
            return (response?.body ?? response) as UserInfo;
          },
        });
        dispatch(setUserInfo(latest));
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              params: {
                screen: 'Tabs',
                params: {
                  screen: 'HomeTab',
                  params: {
                    screen: 'HomeDrawer',
                    params: {
                      screen: 'RecommandPost',
                    },
                  },
                },
              },
            },
          ],
        });
      } catch (err) {
        
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        '프로필 업데이트 중 문제가 발생했습니다.';
      Alert.alert('오류', message);
    },
  });

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();

    if (usernameValidation.error || !usernameValidation.touched) {
      Alert.alert('안내', '닉네임을 올바르게 입력해주세요.');
      return;
    }

    const formData = buildFormData();
    await submitProfile(formData);
  }, [buildFormData, submitProfile, usernameValidation]);

  const isSubmitDisabled = useMemo(() => {
    return (
      isPending ||
      !(
        usernameValidation.touched &&
        !usernameValidation.error 
      )
    );
  }, [isPending, usernameValidation]);

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: insets.top, backgroundColor: colors.background },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 24 })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 32 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              <H1 style={[styles.title, { color: colors.textPrimary }]}>
                프로필을 완성해주세요
              </H1>
              <BodyText style={{ color: colors.textSecondary }}>
                닉네임과 프로필 사진을 등록하면 다른 사용자에게 보여집니다.
              </BodyText>

              <View style={styles.avatarSection}>
                <Pressable
                  onPress={handlePickImage}
                  style={[
                    styles.avatarButton,
                    {
                      borderColor: palette.themeColor,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="프로필 사진 선택"
                >
                  {selectedImage ? (
                    <Image source={{ uri: selectedImage.uri }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="camera-outline" size={48} color={palette.themeColor} />
                  )}
                </Pressable>
                <ButtonComponent
                  label={selectedImage ? '사진 다시 선택' : '사진 선택'}
                  variant="outline"
                  onPress={handlePickImage}
                  fullWidth
                />
              </View>

              <View style={styles.form}>
                <CustomValidateInput
                  inputType="username"
                  value={username}
                  onChangeValue={setUsername}
                  sendValidateValue={handleValidation}
                  placeholder="닉네임을 입력하세요"
                  autoFocus
                />
              </View>

              <ButtonComponent
                label="완료"
                variant="primary"
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
                loading={isPending}
                fullWidth
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
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
  avatarSection: {
    gap: 24,
    alignItems: 'center',
  },
  avatarButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    marginTop: 8,
  },
});

export default UserNameRequired;
