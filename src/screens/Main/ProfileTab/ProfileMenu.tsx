import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileMain from './Pages/ProfileMain';
import { useAppTheme } from '../../../theme/ThemeProvider';
import type { ProfileStackParamList } from '../../../navigation/types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

type ProfileMenuProps = {
  route?: { params?: { username?: string } };
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({ route }) => {
  const { colors } = useAppTheme();
const screenOptions = useMemo(
    () => ({
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: colors.background,
        height: 40,
      },
      headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' as const },
      headerTintColor: colors.textPrimary,
      headerTitleAlign: 'center' as const,
      contentStyle: {
        backgroundColor: colors.background,

      },
    }),
    [colors.background, colors.textPrimary],
  );

  const initialUsername = route?.params?.username;
  const navigatorKey = initialUsername ? `profile-${initialUsername}` : 'profile-self';

  return (
    <Stack.Navigator id={undefined} key={navigatorKey} screenOptions={screenOptions}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMain}
        initialParams={{ username: initialUsername }}
        options={{ headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default ProfileMenu;
