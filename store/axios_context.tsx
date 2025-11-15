import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosHeaders,
  AxiosError,
  AxiosResponse,
} from 'axios';
import { Platform } from 'react-native';
import { saveTokens, loadTokens } from '@clipo/core';

type TokenBundle = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
};


// const navigate = useNavigate();

const resolveServerUrl = () => {
  const envUrl =
    process.env.EXPO_PUBLIC_SERVER_URL
console.log('SERVERURL:',  process.env.EXPO_PUBLIC_SERVER_URL);

  return envUrl
};

const resolveClientUrl = () => {
  const envUrl =
    process.env.EXPO_PUBLIC_CLIENT_URL ??
    process.env.REACT_APP_CLIENT_URL ??
    process.env.CLIENT_URL;

  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
  }

  return 'https://clipofront.netlify.app/';
};

export const SERVERURL = resolveServerUrl();
export const CLIENTURL = resolveClientUrl();



// CORS 헤더 설정 함수
const getCorsHeaders = () => {
  const allowedOrigin =  CLIENTURL;

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
};

export const refreshAxios = axios.create({
    baseURL: SERVERURL,
    withCredentials: true,
    headers: getCorsHeaders(),
  });

  export  const instance = axios.create({
    baseURL: SERVERURL,
    withCredentials: true,
    headers: getCorsHeaders(),
  });

  export  const formInstance = axios.create({
    baseURL: SERVERURL,
    withCredentials: true,
    headers: getCorsHeaders(),
  });

  export  const Axios = axios.create({
    baseURL: SERVERURL,
    withCredentials: true,
    headers: getCorsHeaders(),
  });

  // const axiosConfig: AxiosRequestConfig = {
  //   ...config,
  //   withCredentials: true, // CORS 요청 시 자격 증명 포함
  //   headers: {
  //     'Content-Type': 'application/json', // GET, DELETE는 JSON, 나머지는 URL 인코딩
  //     ...config.headers,
  //   },
  // };
  interface RetriableRequest extends AxiosRequestConfig {
    _retry?: boolean;
  }



    // instance.interceptors.request.use(
    //   (config) => {
    //     const accessToken = getCookie('accessToken');
    //     if (accessToken) {
    //       config.headers['Authorization'] = `Bearer ${accessToken}`;
    //     }
        
    //     // CORS 헤더 추가
    //     const corsHeaders = getCorsHeaders();
    //     Object.assign(config.headers, corsHeaders);
        
    //     return config;
    //   },
    //   (error) => {
    //     // 요청 설정 중 에러 발생 시
    //     return Promise.reject(error);
    //   }
    // );
    
  

    //   instance.interceptors.response.use(
    //     response => response,
    //     async error => {
    //       const originalRequest = error.config as AxiosRequestConfig & { _retryCount?: number };
          
    //       // 1) Access Token 만료 → Refresh Token으로 재발급 시도
    //       if (error.response?.data?.status === 403 && 
    //           error.response.data.code === 'EXPIRED_TOKEN') {
            
    
            
    //         originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
    //         removeCookie('accessToken', { path: '/', secure: true });
            
    //         try {
    //           // Refresh Token으로 새 Access Token 발급
    //           const newToken = await fetchNewAccessToken();
    //           // 인스턴스 헤더 동기화
    //           syncInstanceHeaders(newToken);
    //           if (originalRequest.headers) {
    //             originalRequest.headers.Authorization = `Bearer ${newToken}`;
    //           }
              
    //           // 새 토큰으로 원래 요청 재시도
    //           return instance(originalRequest);
    //         } catch (refreshError) {
    //           // Refresh Token도 만료된 경우 → MainPage에서 처리하도록 expiredToken 설정
    //           removeCookie('accessToken', { path: '/', secure: true });
    //           setCookie('refreshToken', 'expiredToken');
    //           // 세션 만료 시 홈페이지로 리다이렉트
    //           // redirectToHome();
    //           return Promise.reject(error);
    //         }
    //       }
          
    //       // 2) 변조된 토큰 → expiredToken 설정 후 재시도
    //       else if (error.response?.data?.status === 400 && 
    //                error.response.data.code === 'NOT_VALIDATE_TOKEN') {
    //         // 새로운 요청 생성 (Request Interceptor에서 처리됨)
    //         return setExpiredTokenRequest();
    //       }
          
    //       // 3) 인증 실패 (401) → expiredToken 설정 후 재시도
    //       else if (error.response?.data?.status === 401) {
    //         // 새로운 요청 생성 (Request Interceptor에서 처리됨)
    //         return setExpiredTokenRequest();
    //       }
    
    //       // 4) 기타 403 에러 → expiredToken 설정 후 재시도
    //       else if (error.response?.data?.status === 403) {
    //         // 새로운 요청 생성 (Request Interceptor에서 처리됨)
    //         return setExpiredTokenRequest();
    //       }
          
    //       // 4) 네트워크 에러 (5xx, 연결 실패 등) → 재시도
    //       else if (error.response?.status >= 500 || !error.response) {
    //         // originalRequest가 존재하는지 확인
    //         if (!originalRequest) {
    //           return Promise.reject(error);
    //         }
            
    //         // 재시도 횟수 제한 (3회까지)
    //         if ((originalRequest._retryCount ?? 0) >= 3) {
    //           return Promise.reject(error);
    //         }
            
    //         originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
            
    //         // 지수 백오프 (1초, 2초, 4초)
    //         const delay = Math.pow(2, originalRequest._retryCount - 1) * 1000;
            
    //         return new Promise(resolve => {
    //           setTimeout(() => {
    //             resolve(instance(originalRequest));
    //           }, delay);
    //         });
    //       }
          
    //       // 5) 기타 에러는 그대로 전파
    //       return Promise.reject(error);
    //     }
    //   );
  


// 토큰 갱신 후 인스턴스 헤더 동기화 함수
export const syncInstanceHeaders = (accessToken: string) => {
  const clients = [instance, formInstance];
  clients.forEach(client => {
    if (accessToken) {
      client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      delete client.defaults.headers.common.Authorization;
    }
  });
};
let cachedTokens: TokenBundle = {};

const updateCachedTokens = (tokens: TokenBundle) => {
  cachedTokens = tokens;
};

const normalizeTokenBundle = (source: unknown): TokenBundle => {
  if (!source) {
    return {};
  }

  const data = (source as AxiosResponse)?.data ?? source;
  
  // Handle case where body is a string token (from your refresh endpoint)
  let payload = data;
  if (typeof (data as any)?.body === 'string' && (data as any).body?.trim()) {
    // Extract token from string body
    const tokenString = (data as any).body.trim();
    payload = {
      accessToken: tokenString.replace(/^Bearer\s+/i, ''),
    };
  } else if (typeof (data as any)?.body === 'object' && (data as any).body !== null) {
    payload = (data as any).body;
  }

  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const sanitizeToken = (token?: unknown) => {
    if (typeof token !== 'string') {
      return undefined;
    }
    const trimmed = token.trim();
    if (!trimmed) {
      return undefined;
    }
    return trimmed.replace(/^Bearer\s+/i, '');
  };

  const accessToken = sanitizeToken(
    (payload as Record<string, unknown>).accessToken ??
      (payload as Record<string, unknown>).access_token ??
      (payload as Record<string, unknown>).token,
  );

  const refreshToken =
    sanitizeToken(
      (payload as Record<string, unknown>).refreshToken ??
        (payload as Record<string, unknown>).refresh_token,
    ) ?? cachedTokens.refreshToken;

  const expiresAtRaw =
    (payload as Record<string, unknown>).validateTime ??
    (payload as Record<string, unknown>).validate_time ??
    (payload as Record<string, unknown>).expiresAt ??
    (payload as Record<string, unknown>).expireAt ??
    (payload as Record<string, unknown>).expiration ??
    (payload as Record<string, unknown>).expire_at;

  const expiresAt =
    typeof expiresAtRaw === 'string' && expiresAtRaw.trim()
      ? expiresAtRaw.trim()
      : expiresAtRaw != null
      ? String(expiresAtRaw)
      : undefined;

  return {
    accessToken,
    refreshToken,
    expiresAt: expiresAt ?? cachedTokens.expiresAt,
  };
};


const persistTokens = async (tokens: TokenBundle) => {
  const merged: TokenBundle = {
    accessToken: tokens.accessToken ?? cachedTokens.accessToken,
    refreshToken: tokens.refreshToken ?? cachedTokens.refreshToken,
    expiresAt: tokens.expiresAt ?? cachedTokens.expiresAt,
  };

  await saveTokens({
    accessToken: merged.accessToken,
    refreshToken: merged.refreshToken,
    expiresAt: merged.expiresAt,
  });

  syncInstanceHeaders(merged.accessToken ?? '');
  updateCachedTokens(merged);
};

const clearCachedTokens = async () => {
  await saveTokens({
    accessToken: undefined,
    refreshToken: undefined,
    expiresAt: undefined,
  });

  syncInstanceHeaders('');
  updateCachedTokens({});
};

let refreshPromise: Promise<TokenBundle | null> | null = null;

const refreshAccessToken = async (): Promise<TokenBundle | null> => {
  if (!cachedTokens.refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    const corsHeaders = getCorsHeaders();
    refreshPromise = refreshAxios
      .post(
        'api/auth/recreate/accessToken',
        {},
        {
          headers: {
            ...corsHeaders,
            Authorization: `Bearer ${cachedTokens.refreshToken}`,
          },
        },
      )
      .then(async (response) => {
        const tokens = normalizeTokenBundle(response);
        await persistTokens(tokens);
        return cachedTokens;
      })
      .catch(async (error) => {
        await clearCachedTokens();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const shouldAttemptTokenRefresh = (error: AxiosError) => {
  const { response } = error;
  if (!response) {
    return false;
  }

  const status = response.status;
  const code =
    (response.data as { code?: string; errorCode?: string } | undefined)?.code ??
    (response.data as { code?: string; errorCode?: string } | undefined)?.errorCode;

  if (status === 403 && typeof code === 'string' && code.toUpperCase() === 'EXPIRED_TOKEN') {
    return true;
  }

  return false;
};

type RequestInterceptorOptions = {
  attachAuth?: boolean;
};

const applyRequestInterceptors = (
  client: AxiosInstance,
  { attachAuth = true }: RequestInterceptorOptions = {},
) => {
  client.interceptors.request.use(
    async (config) => {
      const headers = AxiosHeaders.from(config.headers ?? {});
      const corsHeaders = getCorsHeaders();

      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value as string);
      });

      if (attachAuth && cachedTokens.accessToken) {
        headers.set('Authorization', `Bearer ${cachedTokens.accessToken}`);
      }

      config.headers = headers;
      return config;
    },
    (error) => Promise.reject(error),
  );
};

type ResponseInterceptorOptions = {
  enableAuthRefresh?: boolean;
};

const applyResponseInterceptors = (
  client: AxiosInstance,
  { enableAuthRefresh = false }: ResponseInterceptorOptions = {},
) => {
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (!enableAuthRefresh) {
        return Promise.reject(error);
      }

      if (!shouldAttemptTokenRefresh(error)) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as RetriableRequest;
      if (originalRequest?._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshed = await refreshAccessToken();
        if (!refreshed?.accessToken) {
          return Promise.reject(error);
        }

        originalRequest.headers = AxiosHeaders.from(originalRequest.headers ?? {});
        (originalRequest.headers as any)['Authorization'] = `Bearer ${refreshed.accessToken}`;

        return client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    },
  );
};

export const initializeAuthTokens = async (): Promise<TokenBundle> => {
  const stored = await loadTokens();
  const normalizedAccessToken = stored?.accessToken?.toString().trim() || '';
  const normalizedRefreshToken = stored?.refreshToken?.toString().trim() || '';
  const normalizedExpiry = stored?.expiresAt?.toString().trim() || '';

  syncInstanceHeaders(normalizedAccessToken);

  const tokens = {
    accessToken: normalizedAccessToken || undefined,
    refreshToken: normalizedRefreshToken || undefined,
    expiresAt: normalizedExpiry || undefined,
  };
  updateCachedTokens(tokens);
  return tokens;
};

export const handleLoginSuccess = async (
  accessToken: string,
  refreshToken: string,
  expiresAt?: string,
) => {
  const normalizedAccessToken = accessToken?.trim() ?? '';
  const normalizedRefreshToken = refreshToken?.trim() ?? '';
  const normalizedExpiry = expiresAt?.toString().trim() ?? '';
  console.log(normalizedAccessToken)
  await saveTokens({
    accessToken: normalizedAccessToken || undefined,
    refreshToken: normalizedRefreshToken || undefined,
    expiresAt: normalizedExpiry || undefined,
  });

  syncInstanceHeaders(normalizedAccessToken);
  const tokens = {
    accessToken: normalizedAccessToken || undefined,
    refreshToken: normalizedRefreshToken || undefined,
    expiresAt: normalizedExpiry || undefined,
  };
  updateCachedTokens(tokens);
  return tokens;
};

applyRequestInterceptors(instance);
applyRequestInterceptors(formInstance);
applyRequestInterceptors(Axios, { attachAuth: false });
applyRequestInterceptors(refreshAxios, { attachAuth: false });

applyResponseInterceptors(instance, { enableAuthRefresh: true });
applyResponseInterceptors(formInstance, { enableAuthRefresh: true });
applyResponseInterceptors(Axios);
applyResponseInterceptors(refreshAxios);
