import { useMutation } from '@tanstack/react-query';
import { handleLoginSuccess } from './axios_context';
import Service from '../store/ApiService';
import { LoginType, SMSValidate, SMS } from '../type';
import { useCallback, useMemo } from 'react';

import { useAppDispatch } from './redux/hooks';
import { setAuth, clearAuth } from './redux/authSlice';

export type RequestType =
  | 'join'
  | 'smsRequest'
  | 'forgetPassword'
  | 'smsVerification'
  | 'login'
  | 'getTemporaryPassword'
  | 'updatePassword'

type RequestPayloadMap = {
  getTemporaryPassword: SMS;
  smsRequest: SMS;
  forgetPassword: SMS;
  smsVerification: SMSValidate;
  login: LoginType;
  join: LoginType;
  updatePassword: { newPassword: string; oldPassword: string };
};



const { AuthService } = Service;



export const useAuthMutations = () => {
  const dispatch = useAppDispatch();
  const smsRequestMutation = useMutation({
    mutationKey: ['auth', 'smsRequest'],
    mutationFn: (payload: SMS) => AuthService.smsRequest(payload),
    // 예: retry 제한, onError 등 공통옵션 추가 가능
  });

  const forgetPasswordMutation = useMutation({
    mutationKey: ['auth', 'forgetPassword'],
    mutationFn: (payload: SMS) => AuthService.forgetPassword(payload),
  });

  const smsVerificationMutation = useMutation({
    mutationKey: ['auth', 'smsVerification'],
    mutationFn: (payload: SMSValidate) => AuthService.smsVerificate(payload),
  });

  const loginMutation = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload: LoginType) => AuthService.login(payload),
    onSuccess: async (res: any) => {
      // 민감정보 로그 제거
      console.log(res)
      const accessTokenRaw = res?.data?.body?.accessToken ?? '';
      const refreshTokenRaw = res?.data?.body?.refreshToken ?? '';
      const validateTime = res?.data?.body?.validateTime ?? res?.body?.expireAt;

      const accessToken = accessTokenRaw.replace(/^Bearer\s+/i, '');
      const refreshToken = refreshTokenRaw.replace(/^Bearer\s+/i, '');

      // 토큰 안전 저장 권장: 서버가 HttpOnly 쿠키로 관리하도록 바꾸는 것이 안전합니다.
      await handleLoginSuccess(accessToken, refreshToken, validateTime);
      console.log('aaa','accesstoken',accessToken,'/',accessTokenRaw)
    },
    onError: (e) => {
      dispatch(clearAuth());
      return e;
    },
    retry: 0, // 로그인 실패 시 불필요한 재시도 방지
  });

  const signUpMutation = useMutation({
    mutationKey: ['auth', 'signUp'],
    mutationFn: (payload: LoginType) => AuthService.signUp(payload),
    onSuccess: () => {
      // toast.success('회원가입 성공');
    },
    onError: (e) => {
      return e;
    },
  });

  const getTemporaryPasswordMutation = useMutation({
    mutationKey: ['auth', 'temporaryPassword'],
    mutationFn: (payload: SMS) => AuthService.forgetPassword(payload),
    onError: (e) => {
      return e;
    },
  });

  const updatePasswordMutation = useMutation({
    mutationKey: ['auth', 'updatePassword'],
    mutationFn: (payload: { newPassword: string; oldPassword: string }) =>
      AuthService.updatePassword(payload),
    onError: (e) => {
      return e;
    },
  });

  const mutationMap = useMemo(
    () => ({
      smsRequest: smsRequestMutation,
      forgetPassword: forgetPasswordMutation,
      smsVerification: smsVerificationMutation,
      login: loginMutation,
      join: signUpMutation,
      updatePassword: updatePasswordMutation,
      getTemporaryPassword: getTemporaryPasswordMutation,
    }),
    [
      smsRequestMutation,
      updatePasswordMutation,
      forgetPasswordMutation,
      getTemporaryPasswordMutation,
      smsVerificationMutation,
      loginMutation,
      signUpMutation,
    ],
  );

  const sendLoginLogic = useCallback(
    async <T extends RequestType>(requestType: T, value: RequestPayloadMap[T]) => {
      const mutation = mutationMap[requestType];
      if (!mutation) throw new Error('Unsupported request type');
      return mutation.mutateAsync(value as any);
    },
    [mutationMap], // 안전하게 mutationMap을 deps로 둠
  );

  return {
    sendLoginLogic,
    mutations: mutationMap,
  };
};
