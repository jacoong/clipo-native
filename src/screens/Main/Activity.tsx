import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ActivityMain from '../../components/ActivityMain';
import ProfileMenu from './ProfileTab/ProfileMenu';
import { ActivityStackParamList } from '../../navigation/types';

const Stack = createNativeStackNavigator<ActivityStackParamList>();

const Activity: React.FC = () => (
  <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ActivityMain" component={ActivityMain} />
    <Stack.Screen
      name="ProfileMenu"
      component={ProfileMenu}
      options={{ headerShown: true, title: '프로필' }}
    />
  </Stack.Navigator>
);

export default Activity;
