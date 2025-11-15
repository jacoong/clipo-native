import React, { useEffect, PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppNavigator from './src/navigation/AppNavigator';
import ModalLayer from './src/components/Modal/ModalLayer';
import { FlashMessageProvider } from './src/components/FlashMessage/FlashMessageProvider';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from './store/redux/store';
import { initializeAuthTokens } from './store/axios_context';
import { setAuth, clearAuth } from './store/redux/authSlice';
import { useAppDispatch } from './store/redux/hooks';

const queryClient = new QueryClient();

const AppBootstrap: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const tokens = await initializeAuthTokens();
      if (tokens.accessToken) {
        dispatch(setAuth(tokens));
      } else {
        dispatch(clearAuth());
      }
    })();
  }, [dispatch]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <FlashMessageProvider>
                <AppBootstrap>
                  <>
                    <AppNavigator />
                    <ModalLayer />
                  </>
                </AppBootstrap>
              </FlashMessageProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </Provider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
