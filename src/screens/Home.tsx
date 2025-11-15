import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';

import Main from '../screens/Home/Main';
import Login from '../screens/Home/Login';
import ForgetPassword from '../screens/Home/ForgetPassword';
import EmailAuthentication from '../components/EmailAuthentication';
import SmsRequest from './Home/SmsRequest';
import SmsAuthentication from './Home/SmsAuthentication';
import SocialLoginPage from '../components/SocialLoginPage';
import JoinPage from '../screens/Home/JoinPage';
import { HomeStackParamList } from '../navigation/types';
import { useAppTheme } from '../theme/ThemeProvider';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const logoImage = require('../../assets/images/logo3.png');

const Home: React.FC = () => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.stackContainer}>
      <Stack.Navigator
        id={undefined}
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerBackTitleVisible: false,
          headerBackTitle: '',
          // headerLeft: (props) =>
          //   props.canGoBack ? (
          //     <HeaderBackButton
          //       onPress={() => navigation.goBack()} // 👈 명시적으로 추가!
          //       tintColor={colors.textPrimary}
          //       style={{ marginLeft: 10 }}
          //     />
          //   ) : undefined,
          headerTitle: () => (
            <Image source={logoImage} style={styles.headerLogo} />
          ),
          contentStyle: { backgroundColor: colors.background },
        })}
      >
        <Stack.Screen name="Main" component={Main} options={{ headerShown: true }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="EmailAuthentication" component={EmailAuthentication} />
        <Stack.Screen name="SocialLogin" component={SocialLoginPage} />
        <Stack.Screen name="Join" component={JoinPage} />
        <Stack.Screen name="SmsRequest" component={SmsRequest} />
        <Stack.Screen name="SmsAuthentication" component={SmsAuthentication} />
      </Stack.Navigator>
    </View>

  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLogo: {
    width: 120,
    height: 36,
    resizeMode: 'contain',
  },
  stackContainer: {
    flex: 1,
  },
});

export default Home;
